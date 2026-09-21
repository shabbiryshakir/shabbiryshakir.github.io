// Pushes everything in content/ to Sanity.
//   npm run sync            -> push all
//   npm run sync -- --dry   -> show what would change, write nothing
//   npm run sync -- my-app  -> push only content/projects/my-app
// Safe to re-run: documents are matched by slug and patched; files are
// deduplicated by Sanity (same file = same asset, no re-upload cost).
import { createClient } from '@sanity/client';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'content');
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const only = args.filter(a => !a.startsWith('--'));

for (const f of ['.env', '.env.local']) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) throw new Error('SANITY_API_WRITE_TOKEN missing from .env.local');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', token, useCdn: false,
});

const IMAGE = /\.(jpe?g|png|webp|gif|avif|svg)$/i;
const FILE = /\.(mp4|mov|webm|m4v|pdf)$/i;
const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const key = () => Math.random().toString(36).slice(2, 14);
const log = (...a) => console.log(DRY ? '[dry]' : '', ...a);
const skillList = skills => skills.map(([skillName, percentage]) => ({ _key: key(), _type: 'skill', skillName, percentage }));

async function upload(file) {
  const kind = IMAGE.test(file) ? 'image' : 'file';
  if (!fs.existsSync(file)) throw new Error(`missing file: ${path.relative(ROOT, file)}`);
  if (DRY) return { _type: kind, asset: { _type: 'reference', _ref: `dry-${path.basename(file)}` } };
  const mb = (fs.statSync(file).size / 1e6).toFixed(1);
  console.log(`  ↑ ${path.relative(CONTENT, file)} (${mb} MB)`);
  const asset = await client.assets.upload(kind, fs.createReadStream(file), { filename: path.basename(file) });
  return { _type: kind, asset: { _type: 'reference', _ref: asset._id } };
}

async function idBySlug(type, slug) {
  return client.fetch(`*[_type == $type && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`, { type, slug });
}

async function upsert(type, slug, fields) {
  const existing = await idBySlug(type, slug);
  log(existing ? 'update' : 'create', type, slug);
  if (DRY) return existing || `${type}-${slug}`;
  if (existing) { await client.patch(existing).set(fields).commit(); return existing; }
  const doc = await client.create({ _id: `${type}-${slug}`, _type: type, slug: { _type: 'slug', current: slug }, ...fields });
  return doc._id;
}

// ---------- profile + about ----------
async function syncProfile() {
  const p = path.join(CONTENT, 'profile.json');
  if (!fs.existsSync(p)) return;
  const { about, profileImage, ...fields } = readJson(p);
  for (const arr of ['ventures', 'qualifications']) {
    if (fields[arr]) fields[arr] = fields[arr].map(x => ({ _key: key(), ...x }));
  }
  if (profileImage) fields.profileImage = await upload(path.join(CONTENT, profileImage));
  const id = await client.fetch(`*[_type == "profile" && !(_id in path("drafts.**"))][0]._id`);
  log('update profile');
  if (!DRY) id ? await client.patch(id).set(fields).commit() : await client.create({ _type: 'profile', ...fields });

  if (about) {
    const { slug = 'about-myself', skills, ...rest } = about;
    await upsert('category', slug, skills ? { ...rest, skillsList: skillList(skills) } : rest);
  }
}

// ---------- categories (desktop folders) ----------
async function syncCategories() {
  const p = path.join(CONTENT, 'categories.json');
  if (!fs.existsSync(p)) return;
  const cats = readJson(p);
  cats.sort((a, b) => (a.parent ? 1 : 0) - (b.parent ? 1 : 0)); // parents first
  for (const { slug, parent, skills, ...rest } of cats) {
    const fields = { ...rest };
    if (parent) fields.parent = { _type: 'reference', _ref: await idBySlug('category', parent) || `category-${parent}` };
    if (skills) fields.skillsList = skillList(skills);
    await upsert('category', slug, fields);
  }
}

// ---------- projects ----------
async function syncProject(slug) {
  const dir = path.join(CONTENT, 'projects', slug);
  const cfgPath = path.join(dir, 'project.json');
  if (!fs.existsSync(cfgPath)) return console.warn(`skip ${slug}: no project.json`);
  const cfg = readJson(cfgPath);
  console.log(`\n▶ ${slug}`);

  const catId = await idBySlug('category', cfg.category);
  if (!catId && !DRY) throw new Error(`${slug}: category "${cfg.category}" not found. Add it to content/categories.json`);

  const fields = {
    title: cfg.title,
    description: cfg.description || '',
    projectType: cfg.type || 'website',
    color: cfg.color || '#ffffff',
    isExternalMedia: !!cfg.external,
    showExternalLink: !!cfg.showExternalLink,
    category: { _type: 'reference', _ref: catId || `category-${cfg.category}` },
  };
  if (cfg.link) fields.link = cfg.link;

  const files = fs.readdirSync(dir).filter(f => IMAGE.test(f) || FILE.test(f)).sort();
  const cover = cfg.cover || files.find(f => /^cover\./i.test(f));
  if (cover) fields.coverImage = await upload(path.join(dir, cover));
  if (cfg.main) {
    const up = await upload(path.join(dir, cfg.main));
    fields[up._type === 'image' ? 'uploadImage' : /\.(mp4|mov|webm|m4v)$/i.test(cfg.main) ? 'uploadVideo' : 'uploadFile'] = up;
  }

  // gallery: explicit list, or every other media file in the folder
  const galleryCfg = cfg.gallery ?? files.filter(f => f !== cover && f !== cfg.main).map(f => ({ file: f }));
  fields.gallery = [];
  for (const g of galleryCfg) {
    const item = { _key: key(), _type: 'mediaItem', caption: g.caption || '' };
    if (g.url) item.url = g.url;
    if (g.file) {
      const up = await upload(path.join(dir, g.file));
      item[up._type === 'image' ? 'image' : 'file'] = up;
    }
    fields.gallery.push(item);
  }
  await upsert('project', slug, fields);
}

async function syncRemovals() {
  const p = path.join(CONTENT, 'remove.json');
  if (!fs.existsSync(p)) return;
  for (const slug of readJson(p)) {
    const id = await idBySlug('project', slug) || await idBySlug('category', slug);
    if (!id) continue;
    log('delete', slug);
    if (!DRY) await client.delete(id);
  }
}

if (only.length === 0) {
  await syncProfile();
  await syncCategories();
}
const projDir = path.join(CONTENT, 'projects');
const slugs = only.length ? only
  : fs.existsSync(projDir) ? fs.readdirSync(projDir).filter(d => !d.startsWith('_') && fs.statSync(path.join(projDir, d)).isDirectory()) : [];
for (const s of slugs) await syncProject(s);
if (only.length === 0) await syncRemovals();
console.log('\n✓ done' + (DRY ? ' (dry run, nothing written)' : ''));
