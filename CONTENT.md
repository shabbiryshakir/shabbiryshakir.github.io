# Updating portfolio content

Live site: https://shabbiryshakir.github.io (GitHub Pages, repo `shabbiryshakir/shabbiryshakir.github.io`, branch `master`).
All text, images, videos and PDFs live in **Sanity** (project `1o5ie8oi` "Shabbir's Portfolio", dataset `production`).
You never need to log in to Sanity: edit files in `content/` and run the sync script.

## How it works

```
content/  --npm run sync-->  Sanity  --(read in browser)-->  live site
```

- The home page fetches Sanity **in the browser**, so profile/text/project changes appear live right after `npm run sync`, no deploy needed.
- `/demo/<slug>` pages are built at deploy time, so **new** projects also need a push to `master` (GitHub Actions rebuilds, ~3 min).
- The write token is `SANITY_API_WRITE_TOKEN` in `.env.local` (gitignored; never commit it — this repo is public).

## Commands

| Command | What it does |
|---|---|
| `npm run sync -- --dry` | Preview changes, writes nothing |
| `npm run sync` | Push everything in `content/` |
| `npm run sync -- my-app` | Push only `content/projects/my-app` |
| `git add -A && git commit -m "..." && git push` | Redeploy (needed for new projects / code changes) |

Re-running sync is safe: documents are matched by slug and updated; identical files are not re-uploaded.

## Files

### `content/profile.json` — you + About page
`name, fullName, role, location, company, tagline, email, whatsapp, github, linkedin, instagram`,
`profileImage` (path relative to `content/`, e.g. `"me.jpg"`),
`ventures[]` `{name, role, description, link}`,
`qualifications[]` `{title, institution, year}`,
`about` `{slug:"about-myself", description, info, skills:[["Skill", 80], ...]}` — omit `skills` to keep existing bars.

### `content/categories.json` — desktop folders
`[{ slug, title, parent?, description?, info?, icon? ("fa-solid fa-code"), color?, skills? }]`
Existing slugs: `about-myself, web-dev, videos, designs, photography, phs-portal (inside web-dev)`.

### `content/projects/<slug>/` — one folder per project
Put all the project's media in the folder plus a `project.json` (see `_example/`; folders starting with `_` are ignored):

| Field | Notes |
|---|---|
| `title`, `description` | shown in the window |
| `category` | folder slug it appears in |
| `type` | `website` (iframe of `link`), `video` (YouTube `link`), `photo`, `pdf` |
| `link` | live URL / YouTube URL |
| `cover` | card image; defaults to a file named `cover.*` |
| `main` | optional main image/PDF shown first |
| `gallery` | `[{file, caption}]` or `[{url, caption}]`. **Omit it** to auto-include every other image/video/PDF in the folder |
| `external` | `true` = show a case-study card + "View Live" button instead of embedding (use for sites that block iframes) |
| `showExternalLink`, `color` | optional |

Supported files: jpg/png/webp/gif/avif/svg, mp4/mov/webm/m4v, pdf.
Big videos: prefer YouTube/Vimeo links (Sanity free plan storage is limited).

### `content/remove.json`
List of project/folder slugs to delete from Sanity, e.g. `["old-project"]`. Empty it after syncing.

## Existing projects (in Sanity, not yet in `content/`)
business-display-website, anglophone-movie, ala-deen-trailer, student-management-portal, lsd-paper-maker, jameanwar-bird.
Creating `content/projects/<same-slug>/` updates that project instead of making a duplicate.

## Code map
- `app/page.tsx` — whole OS UI; GROQ query in `fetchSanityData`; `AboutMeApp` (profile/ventures/qualifications), `ProjectViewerApp` + `GalleryMedia` (gallery strip).
- `app/demo/[slug]/page.tsx` — static per-project page.
- `sanity/*.ts` — schemas (profile, category, project, skill). Studio at `/studio` (local `npm run dev`).
- `scripts/sync-content.mjs` — the sync script.

## Workflow for a new session
1. Drop files into `content/projects/<slug>/`, write `project.json` (or just tell Claude the details).
2. `npm run sync -- --dry`, then `npm run sync`.
3. Check `npm run dev` → http://localhost:3000.
4. Commit + push to `master`.

Backups: `content/_backup/*.ndjson` (gitignored) — full dataset export from 2026-09-21 before this setup.
