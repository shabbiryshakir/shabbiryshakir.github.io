import { createClient } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

// ADD THIS FUNCTION: It tells Next.js which URLs to pre-build
export async function generateStaticParams() {
  const projects = await client.fetch(`*[_type == "project"]{ "slug": slug.current }`);
  
  return projects.map((project: any) => ({
    slug: project.slug,
  }));
}

interface PageProps { params: Promise<{ slug: string }>; }

const getYouTubeEmbedUrl = (url: string | null) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : url;
};

export default async function ProjectDemoPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 💡 NEW: Fetches the profile data to keep the Menu Bar perfectly synced!
  const query = `{
    "profile": *[_type == "profile"][0]{ name, "profileImage": profileImage.asset->url },
    "project": *[_type == "project" && slug.current == $slug][0]{
      title, description, projectType, link, color, 
      "imageUrl": coalesce(uploadImage.asset->url, image.asset->url, coverImage.asset->url),
      "fileUrl": coalesce(uploadFile.asset->url, file.asset->url)
    }
  }`;
  
  const data = await client.fetch(query, { slug });
  const project = data.project;
  const profile = data.profile;

  if (!project) return notFound();

  const themeColor = project.color || "#4da6ff";
  
  const rawType = (project.projectType || "").toLowerCase();
  const isVideo = rawType.includes("video") || rawType.includes("film") || rawType.includes("movie");
  const isPdf = rawType.includes("pdf") || rawType.includes("document") || project.fileUrl;
  const isPhoto = rawType.includes("photo") || rawType.includes("poster") || rawType.includes("image") || project.imageUrl;
  const isWeb = !isVideo && !isPhoto && !isPdf;

  const finalPdfUrl = project.fileUrl || project.link;
  const finalImageUrl = project.imageUrl; 

  return (
    <main className="fixed inset-0 w-screen h-[100dvh] bg-[#030712] text-white font-sans overflow-hidden flex flex-col pointer-events-auto">
      
      {/* 💡 VIBRANT CSS BACKGROUND ORBS (Matches the Desktop Wallpaper) */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none mix-blend-screen z-0 hidden md:block"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none mix-blend-screen z-0"></div>
      <div className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none mix-blend-screen z-0"></div>

      {/* 💡 PERFECTLY SYNCED MENU BAR */}
      <header className="w-full h-10 flex items-center justify-between px-6 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/10 z-[200] shadow-md flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] overflow-hidden">
            {profile?.profileImage ? <img src={profile.profileImage} className="w-full h-full object-cover" alt="Profile" /> : <span className="text-[#030712] text-[11px] font-black">S</span>}
          </div>
          <span className="text-sm font-semibold tracking-wide truncate max-w-[150px]">{profile?.name || "Shabbir Shakir"}</span>
          <span className="text-xs font-medium text-white/40 px-3 border-l border-white/10 uppercase hidden sm:block">
            Project Viewer
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-white/80">
          <i className="fas fa-wifi text-sm"></i>
          <i className="fas fa-battery-full text-white text-sm"></i>
        </div>
      </header>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full blur-[150px] opacity-20 pointer-events-none" style={{ backgroundColor: themeColor }}></div>

      <div className="flex-1 w-full relative z-10 flex items-center justify-center md:p-8 overflow-hidden pointer-events-auto">
        <div className="w-full h-full md:w-[95vw] md:h-[90vh] bg-white/[0.03] backdrop-blur-3xl md:border border-white/10 md:rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-300">
          
          <div className="h-14 w-full flex items-center px-3 md:px-6 border-b border-white/10 bg-[#1a1a1c] z-[100] relative flex-shrink-0">
            <div className="flex items-center gap-2 md:gap-4 w-1/3">
              <Link href="/" className="flex md:hidden items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/10 shadow-xl group">
                <i className="fas fa-arrow-left text-xs text-white group-hover:-translate-x-1 transition-transform"></i>
                <span className="text-[10px] font-bold tracking-wider uppercase mt-[1px]">Desktop</span>
              </Link>
              <div className="hidden md:flex items-center gap-2 ml-2">
                <Link href="/"><div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-black/20 flex items-center justify-center group shadow-sm hover:brightness-110"><i className="fas fa-times text-[8px] text-black opacity-0 group-hover:opacity-100"></i></div></Link>
                <Link href="/"><div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-black/20 flex items-center justify-center group shadow-sm hover:brightness-110"><i className="fas fa-minus text-[8px] text-black opacity-0 group-hover:opacity-100"></i></div></Link>
                <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F]/20 border border-white/5"></div>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1.5 rounded-md bg-black/50 border border-white/5 text-[10px] md:text-[11px] font-medium tracking-wide text-white/60 flex items-center gap-2 truncate max-w-[180px] md:max-w-sm">
                <span className="truncate">{project.title}</span>
              </div>
            </div>
            
            <div className="w-1/3 flex justify-end">
               <span className="hidden md:block text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 border border-white/10 px-2 py-1 rounded">{rawType || "FILE"}</span>
            </div>
          </div>

          <div className="flex-1 w-full relative bg-white overflow-hidden flex flex-col">
            {isWeb && project.link && <iframe src={project.link} className="w-full h-full border-none flex-1" title={project.title} />}
            {isVideo && project.link && <iframe src={getYouTubeEmbedUrl(project.link) || project.link} className="w-full h-full border-none bg-black flex-1" allowFullScreen />}
            
            {isPdf && finalPdfUrl && (
              <div className="flex-1 w-full h-full overflow-y-auto touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
                <iframe src={`${finalPdfUrl}#toolbar=0`} className="w-full h-full border-none bg-[#323639]" title={project.title} />
              </div>
            )}
            
            {isPhoto && finalImageUrl && (
               <div className="flex-1 w-full h-full bg-[#111111] overflow-y-auto p-4 md:p-8 flex flex-col items-center relative">
                 <img src={finalImageUrl} draggable="false" className="w-full h-auto max-h-[75vh] object-contain rounded shadow-2xl mb-8 select-none pointer-events-none" alt={project.title} />
                 <div className="absolute inset-0 z-10 pointer-events-none"></div>
                 <div className="w-full max-w-2xl text-center bg-white/5 p-6 rounded-xl border border-white/10 relative z-20">
                   <h1 className="text-xl font-bold mb-2 text-white">{project.title}</h1>
                   <p className="text-sm opacity-60 font-light text-white">{project.description}</p>
                 </div>
               </div>
            )}

            {((isWeb || isVideo || isPdf || isPhoto) && !finalPdfUrl && !project.link && !finalImageUrl) && (
               <div className="flex-1 bg-[#0a0a0a] flex flex-col items-center justify-center text-center p-8">
                 <i className="fas fa-file text-6xl mb-6 opacity-20"></i>
                 <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
                 <p className="max-w-md text-sm text-white/40">File or Link not uploaded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}