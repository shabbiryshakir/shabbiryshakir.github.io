import { createClient } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export async function generateStaticParams() {
  const query = `*[_type == "project"]{ "slug": slug.current }`;
  const projects = await client.fetch(query);
  return projects.map((project: { slug: string }) => ({
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

  const query = `{
    "profile": *[_type == "profile"][0]{ name, "profileImage": profileImage.asset->url },
    "project": *[_type == "project" && slug.current == $slug][0]{
      title, description, projectType, link, color, showExternalLink, isExternalMedia,
      "contentImageUrl": coalesce(uploadImage.asset->url, image.asset->url), 
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
  const isPhoto = rawType.includes("photo") || rawType.includes("poster") || rawType.includes("image") || project.contentImageUrl;
  const isWeb = !isVideo && !isPhoto && !isPdf;

  const finalPdfUrl = project.fileUrl || project.link;
  const finalImageUrl = project.contentImageUrl; 

  return (
    <main className="fixed inset-0 w-screen h-[100dvh] bg-[#030712] text-white font-sans overflow-hidden flex flex-col pointer-events-auto select-none" style={{ WebkitTouchCallout: 'none' }}>
      
      <script 
        dangerouslySetInnerHTML={{ 
          __html: `
            document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
            document.addEventListener('dragstart', function(e) { e.preventDefault(); });
          ` 
        }} 
      />

      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none mix-blend-screen z-0 hidden md:block"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none mix-blend-screen z-0"></div>
      <div className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none mix-blend-screen z-0"></div>

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

            <div className="flex-1 flex justify-center items-center">
              <div className="flex items-center pointer-events-auto">
                <div className="px-4 py-1.5 rounded-md bg-black/50 border border-white/5 text-[10px] md:text-[11px] font-medium tracking-wide text-white/60 flex items-center gap-2 max-w-[150px] md:max-w-sm overflow-hidden">
                  <i className="fas fa-lock text-[9px] opacity-50 flex-shrink-0"></i>
                  <span className="truncate">{project.title}</span>
                </div>
                
                {isWeb && project.description && (
                  <div className="relative group/info outline-none ml-2" tabIndex={0}>
                    <button className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-white/10 transition-colors focus:outline-none">
                      <i className="fas fa-info-circle text-[10px] text-white/50 group-focus-within/info:text-white transition-colors"></i>
                    </button>
                    
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 md:w-80 p-4 bg-[#1a1a1c]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-focus-within/info:opacity-100 group-focus-within/info:visible transition-all z-[100] pointer-events-auto origin-top scale-95 group-focus-within/info:scale-100 cursor-default">
                      <h4 className="text-white text-xs font-bold mb-1.5">{project.title}</h4>
                      <p className="text-white/60 text-[10px] md:text-xs leading-relaxed whitespace-pre-wrap">{project.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-1/3 flex justify-end items-center gap-3">
               {project.showExternalLink && project.link && !project.isExternalMedia && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-all border border-white/10 group/link"
                  >
                     <span className="hidden md:block text-[9px] font-bold tracking-wider uppercase text-white/80 group-hover/link:text-white">Open Browser</span>
                     <i className="fas fa-external-link-alt text-[10px] text-white/70 group-hover/link:text-white"></i>
                  </a>
               )}
               <span className="hidden md:block text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 border border-white/10 px-2 py-1 rounded">{rawType || "FILE"}</span>
            </div>
          </div>

          <div className="flex-1 w-full h-full relative bg-[#0a0a0c] overflow-hidden flex flex-col">
            
            <div className="flex-1 w-full relative overflow-hidden flex items-center justify-center">
              
              {project.isExternalMedia ? (
                <div className="flex-1 w-full h-full bg-[#0a0a0c] flex flex-col items-center justify-center p-6 md:p-10 text-center relative overflow-hidden">
                   
                   {finalImageUrl && (
                     <>
                       <div className="absolute inset-0 bg-center bg-cover opacity-20 blur-2xl scale-110 pointer-events-none" style={{ backgroundImage: `url(${finalImageUrl})` }}></div>
                       <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-[#0a0a0c]/40 pointer-events-none"></div>
                     </>
                   )}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20" style={{ backgroundColor: project.color || '#4da6ff' }}></div>
                   
                   <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative z-10 shadow-2xl overflow-hidden backdrop-blur-xl">
                      {finalImageUrl ? (
                         <img src={finalImageUrl} alt={project.title} className="w-full h-full object-cover opacity-90" />
                      ) : (
                         <i className={`fas ${isPdf ? 'fa-file-pdf' : isVideo ? 'fa-play' : isPhoto ? 'fa-image' : 'fa-external-link-alt'} text-4xl md:text-5xl opacity-80`} style={{ color: project.color || '#ffffff' }}></i>
                      )}
                   </div>
                   
                   <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight relative z-10">{project.title}</h2>
                   <div className="w-16 h-1 rounded-full mb-6 relative z-10" style={{ backgroundColor: project.color || '#4da6ff', opacity: 0.6 }}></div>
                   
                   {project.description ? (
                      <p className="text-sm md:text-base text-white/70 max-w-2xl mb-10 leading-relaxed font-light relative z-10 whitespace-pre-wrap px-4">
                         {project.description}
                      </p>
                   ) : (
                      <p className="text-sm md:text-base text-white/40 max-w-2xl mb-10 leading-relaxed font-light relative z-10">
                         Click below to view the full details and live media for this project.
                      </p>
                   )}
                   
                   {project.link && (
                     <a 
                       href={project.link} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-3 group relative z-10 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
                     >
                        View Live Project
                        <i className="fas fa-arrow-right transition-transform group-hover:translate-x-1 text-xs opacity-70"></i>
                     </a>
                   )}
                </div>
              ) : (
                <>
                  {isWeb && project.link && <iframe src={project.link} className="w-full h-full border-none" title={project.title} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />}
                  {isVideo && project.link && <iframe src={getYouTubeEmbedUrl(project.link) || project.link} className="w-full h-full border-none bg-black" allowFullScreen />}
                  {isPdf && finalPdfUrl && <iframe src={`${finalPdfUrl}#toolbar=0`} className="w-full h-full border-none bg-[#323639]" title={project.title} />}
                  
                  {isPhoto && finalImageUrl && (
                      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8 bg-[#111111]">
                        <img src={finalImageUrl} draggable="false" className="w-full h-full object-contain rounded shadow-2xl select-none pointer-events-none" alt={project.title} />
                        <div className="absolute inset-0 z-10 bg-transparent"></div>
                      </div>
                  )}

                  {((isWeb || isVideo || isPdf || isPhoto) && !finalPdfUrl && !project.link && !finalImageUrl) && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-white">
                        <i className={`fas ${isPdf ? 'fa-file-pdf' : isWeb ? 'fa-code' : 'fa-video'} text-6xl mb-6 opacity-20`}></i>
                        <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
                        <p className="max-w-md text-sm text-white/40">File or Link not uploaded yet.</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {(!isWeb && !project.isExternalMedia) && (
              <div className="w-full bg-[#1a1a1c] border-t border-white/10 p-4 md:p-6 flex flex-col justify-center z-20 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <h3 className="text-white text-base md:text-lg font-bold tracking-wide">{project.title}</h3>
                {project.description && <p className="text-white/60 text-xs md:text-sm mt-1.5 leading-relaxed font-light max-w-4xl">{project.description}</p>}
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}