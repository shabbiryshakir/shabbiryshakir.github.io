"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Environment, Sphere, MeshDistortMaterial, Float, Icosahedron, Torus } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "next-sanity";
import { useRouter } from "next/navigation";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

interface Skill { skillName: string; percentage: number; }
interface LifeNode {
  id: string; title: string; description: string; icon?: string; color: string;
  info?: string; type: 'category' | 'project'; link?: string; 
  coverUrl?: string; contentImageUrl?: string; 
  parentId?: string; skillsList?: Skill[]; nested?: LifeNode[]; projectType?: string;
  fileUrl?: string; showExternalLink?: boolean; isExternalMedia?: boolean;
}
interface AppWindow { id: string; title: string; data: LifeNode; }

interface UserProfile {
  name: string; fullName?: string; role: string; location: string; company?: string; profileImage: string;
  github?: string; linkedin?: string; email?: string; whatsapp?: string; instagram?: string;
}

// --- 1. DYNAMIC LIVING WALLPAPER (VIBRANT 3D) ---
function FloatingSkillNodes() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2} position={[-5, 2, -4]}>
        <Icosahedron args={[1, 0]}><meshPhysicalMaterial color="#FF5F56" transparent opacity={0.2} roughness={0.1} metalness={0.8} /></Icosahedron>
      </Float>
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5} position={[6, -2, -6]}>
        <Torus args={[1, 0.3, 16, 32]}><meshPhysicalMaterial color="#FFBD2E" transparent opacity={0.2} roughness={0.1} metalness={0.8} /></Torus>
      </Float>
      <Float speed={1.2} rotationIntensity={0.8} floatIntensity={2.5} position={[-4, -3, -5]}>
        <Sphere args={[0.8, 32, 32]}><meshPhysicalMaterial color="#27C93F" transparent opacity={0.2} roughness={0.1} metalness={0.8} /></Sphere>
      </Float>
    </>
  );
}

function SpatialBackground() {
  const sphereRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.03;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });
  return (
    <group>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <Environment preset="city" />
      <Sphere ref={sphereRef} args={[3, 64, 64]} scale={1.5} position={[0, 0, -2]}>
        <MeshDistortMaterial color="#8b5cf6" attach="material" distort={0.4} speed={1.5} roughness={0.2} metalness={0.8} transparent opacity={0.15} />
      </Sphere>
      <FloatingSkillNodes />
    </group>
  );
}

// --- 2. MODULAR WIDGETS ---
const WidgetCalendar = ({ className = "" }: { className?: string }) => {
  const date = new Date();
  const dayString = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthString = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();
  const dateNum = date.getDate();

  return (
    <div className={`rounded-[1.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl p-4 md:p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute top-0 left-0 w-full h-8 md:h-10 bg-[#FF5F56]/20 border-b border-[#FF5F56]/30"></div>
      <span className="text-[#FF5F56] font-bold text-[10px] md:text-xs tracking-widest uppercase relative z-10">{dayString}</span>
      <span className="text-white text-6xl md:text-7xl font-light tracking-tighter leading-none relative z-10 mt-1 md:mt-2">{dateNum}</span>
      <span className="text-white/50 text-[9px] md:text-xs font-bold tracking-widest uppercase relative z-10">{monthString} {year}</span>
    </div>
  );
};

const WidgetTelemetry = ({ totalProjects, workFolders, handleOpenTelemetry, className = "" }: any) => (
  <div onClick={handleOpenTelemetry} className={`rounded-[1.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl p-4 md:p-5 flex flex-col shadow-2xl cursor-pointer hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 pointer-events-auto group relative overflow-hidden ${className}`}>
    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
      <i className="fas fa-chart-pie text-[#27C93F] text-sm"></i>
      <span className="text-white/60 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Telemetry</span>
    </div>
    <div className="text-3xl md:text-4xl font-light text-white mb-2 md:mb-4 leading-none">{totalProjects} <span className="text-xs md:text-sm font-bold text-white/40 uppercase tracking-widest relative -top-2 md:-top-3">Apps</span></div>
    <div className="flex flex-col gap-2 md:gap-3 flex-1 overflow-hidden">
      {workFolders.slice(0, 3).map((folder: any, idx: number) => (
        <div key={idx} className="flex items-center justify-between">
            <span className="text-[10px] md:text-xs text-white/70 font-medium truncate w-16 md:w-20"><i className={`fas ${folder.icon} mr-1.5 md:mr-2 opacity-50 text-[9px] md:text-[10px]`}></i>{folder.title}</span>
            <span className="text-[9px] md:text-xs font-bold text-white bg-white/10 px-1.5 md:px-2 py-0.5 rounded-md">{folder.nested?.length || 0}</span>
        </div>
      ))}
    </div>
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm z-20">
       <i className="fas fa-external-link-alt text-white text-xl drop-shadow-lg"></i>
    </div>
  </div>
);

const WidgetSystem = ({ profile, handleOpenSystem, className = "" }: any) => (
  <div onClick={handleOpenSystem} className={`w-full rounded-[1.5rem] bg-black/20 border border-white/10 backdrop-blur-3xl p-4 md:p-5 flex flex-col shadow-2xl cursor-pointer hover:bg-black/30 hover:scale-[1.02] transition-all duration-300 pointer-events-auto group ${className}`}>
    <div className="flex items-center gap-4 border-b border-white/10 pb-3">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1rem] bg-gradient-to-tr from-[#4da6ff] to-purple-500 flex items-center justify-center shadow-lg overflow-hidden relative flex-shrink-0">
           {profile?.profileImage ? (
             <img src={profile.profileImage} className="w-full h-full object-cover" alt="Profile" />
           ) : (
             <i className="fas fa-microchip text-white text-xl"></i>
           )}
           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><i className="fas fa-external-link-alt text-white text-xs"></i></div>
        </div>
        <div className="flex flex-col gap-0.5 overflow-hidden">
          <p className="text-white/40 text-[8px] md:text-[9px] uppercase tracking-widest font-bold">System Admin</p>
          <p className="text-white text-sm md:text-base font-bold tracking-wide truncate">{profile?.name || "Loading..."}</p>
          <p className="text-white/60 text-[9px] md:text-xs font-medium tracking-wide truncate mt-0.5"><i className="fas fa-map-marker-alt text-[#4da6ff] mr-1"></i>{profile?.location || "Unknown"}</p>
        </div>
    </div>
    
    <div className="grid grid-cols-2 gap-3 mt-4">
       <div className="flex flex-col gap-1 bg-white/5 p-3 rounded-lg md:rounded-xl border border-white/10">
          <p className="text-[#4da6ff] text-[8px] md:text-[9px] uppercase tracking-widest font-bold">Primary Directive</p>
          <p className="text-white text-xs md:text-sm font-semibold tracking-wide leading-tight">Automating Everything</p>
       </div>
       <div className="flex flex-col gap-1 bg-white/5 p-3 rounded-lg md:rounded-xl border border-white/10">
          <p className="text-[#FFBD2E] text-[8px] md:text-[9px] uppercase tracking-widest font-bold">Brain CPU Load</p>
          <p className="text-white text-xs md:text-sm font-semibold tracking-wide leading-tight">99% (Apps Script)</p>
       </div>
       <div className="flex flex-col gap-1 bg-white/5 p-3 rounded-lg md:rounded-xl border border-white/10">
          <p className="text-[#27C93F] text-[8px] md:text-[9px] uppercase tracking-widest font-bold">Coffee / Chai Level</p>
          <p className="text-white text-xs md:text-sm font-semibold tracking-wide leading-tight">Critically High</p>
       </div>
       <div className="flex flex-col gap-1 bg-white/5 p-3 rounded-lg md:rounded-xl border border-white/10">
          <p className="text-[#FF5F56] text-[8px] md:text-[9px] uppercase tracking-widest font-bold">Current Status</p>
          <p className="text-white text-xs md:text-sm font-semibold tracking-wide leading-tight">Teacher by Day, Dev by Night</p>
       </div>
    </div>
  </div>
);

const WidgetMusic = ({ className = "" }: { className?: string }) => (
  <div className={`w-full rounded-[1.5rem] bg-black/20 border border-white/10 backdrop-blur-3xl p-4 flex items-center gap-4 shadow-2xl pointer-events-auto hover:bg-black/30 transition-all duration-300 ${className}`}>
    <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg relative flex-shrink-0 group cursor-pointer">
      <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop" alt="Album Cover" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <i className="fas fa-play text-white text-sm"></i>
      </div>
    </div>
    <div className="flex flex-col flex-1 overflow-hidden">
      <p className="text-[9px] text-[#4da6ff] uppercase tracking-widest font-bold mb-0.5">Now Playing</p>
      <p className="text-white text-sm font-bold truncate">Focus Workflow</p>
      <p className="text-white/60 text-[10px] font-medium truncate">System Audio</p>
    </div>
    <div className="flex items-center gap-3 pr-2">
       <i className="fas fa-backward-step text-white/40 hover:text-white cursor-pointer transition-colors text-xs"></i>
       <i className="fas fa-pause text-white hover:text-[#4da6ff] cursor-pointer transition-colors text-sm"></i>
       <i className="fas fa-forward-step text-white/40 hover:text-white cursor-pointer transition-colors text-xs"></i>
    </div>
  </div>
);

// --- 3. SYSTEM APPS ---
function AboutMeApp({ data, profile }: { data: LifeNode, profile: UserProfile | null }) {
  return (
    <div className="flex flex-col md:flex-row w-full flex-1 bg-[#0a0a0c]/40 pb-32 md:pb-0 overflow-y-auto md:overflow-hidden">
      <div className="w-full md:w-[35%] bg-black/40 border-b md:border-b-0 md:border-r border-white/5 p-8 pt-12 md:pt-8 flex flex-col items-center md:justify-center relative flex-shrink-0 md:overflow-y-auto custom-scrollbar">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#4da6ff]/20 to-transparent opacity-50 pointer-events-none"></div>
        <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#4da6ff] to-[#27C93F] mb-6 shadow-2xl z-10 mt-4 md:mt-0">
          <div className="w-full h-full rounded-full bg-[#1a1a1c] overflow-hidden border-2 border-[#1a1a1c]">
            <img src={profile?.profileImage || "/profile.jpg"} alt={profile?.name || "Profile"} draggable="false" className="w-full h-full object-cover select-none pointer-events-none" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=random&color=fff&size=256'; }} />
          </div>
          <div className="absolute bottom-1 right-3 w-4 h-4 bg-green-500 border-2 border-[#1a1a1c] rounded-full animate-pulse shadow-[0_0_10px_#27C93F]"></div>
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide z-10 text-center px-2">{profile?.fullName || profile?.name || "System Admin"}</h2>
        <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-[0.3em] mt-2 z-10 text-center font-semibold">{profile?.role || "Architect"}</p>
        
        <div className="flex flex-col gap-2 mt-6 z-10 w-full px-4">
          {profile?.location && (
            <div className="flex items-center gap-3 text-xs text-white/70 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <i className="fas fa-map-marker-alt text-[#4da6ff] w-4 text-center"></i> {profile.location}
            </div>
          )}
          {profile?.company && (
            <div className="flex items-center gap-3 text-xs text-white/70 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <i className="fas fa-building text-[#27C93F] w-4 text-center"></i> {profile.company}
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full md:w-[65%] p-8 md:p-10 flex flex-col gap-10 md:overflow-y-auto custom-scrollbar">
         <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4 font-bold flex items-center gap-2"><i className="fas fa-fingerprint text-[#4da6ff]"></i> Identity Overview</h3>
            <p className="text-sm md:text-base text-white/80 leading-relaxed font-light">{data.info || data.description || "System data not found in Sanity CMS."}</p>
         </div>
         {data.skillsList && data.skillsList.length > 0 && (
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-6 font-bold flex items-center gap-2"><i className="fas fa-microchip text-[#FFBD2E]"></i> Core Capabilities</h3>
              <div className="flex flex-col gap-5">
                 {data.skillsList.map((skill, idx) => (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="flex items-center gap-4 group">
                       <span className="text-xs font-medium text-white/80 w-28 truncate uppercase tracking-wider">{skill.skillName}</span>
                       <div className="flex-1 h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${skill.percentage}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ backgroundColor: data.color || '#4da6ff' }} />
                       </div>
                       <span className="text-[10px] font-bold text-white/50 w-10 text-right group-hover:text-white transition-colors">{skill.percentage}%</span>
                    </motion.div>
                 ))}
              </div>
            </div>
         )}
      </div>
    </div>
  );
}

function ProjectViewerApp({ data }: { data: LifeNode }) {
  const getYouTubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : url;
  };

  const rawType = (data.projectType || "website").toLowerCase();
  const isVideo = rawType.includes("video") || rawType.includes("film") || rawType.includes("movie");
  const isPdf = rawType.includes("pdf") || rawType.includes("document");
  const isPhoto = rawType.includes("photo") || rawType.includes("poster") || rawType.includes("image");
  const isWeb = !isVideo && !isPhoto && !isPdf;

  const finalPdfUrl = data.fileUrl || data.link;
  const finalImageUrl = data.contentImageUrl; 

  return (
    <div className="flex-1 w-full h-full relative bg-[#0a0a0c] overflow-hidden pointer-events-auto flex flex-col">
      
      {/* --- MEDIA DISPLAY AREA --- */}
      <div className="flex-1 w-full relative overflow-hidden flex items-center justify-center">
        {/* 💡 THE SECURE EXTERNAL CASE STUDY UI */}
        {data.isExternalMedia ? (
          <div className="flex-1 w-full h-full bg-[#0a0a0c] flex flex-col items-center justify-center p-6 md:p-10 text-center relative overflow-hidden">
             {finalImageUrl && (
               <>
                 <div className="absolute inset-0 bg-center bg-cover opacity-20 blur-2xl scale-110 pointer-events-none" style={{ backgroundImage: `url(${finalImageUrl})` }}></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-[#0a0a0c]/40 pointer-events-none"></div>
               </>
             )}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20" style={{ backgroundColor: data.color || '#4da6ff' }}></div>
             
             <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative z-10 shadow-2xl overflow-hidden backdrop-blur-xl">
                {finalImageUrl ? (
                   <img src={finalImageUrl} alt={data.title} className="w-full h-full object-cover opacity-90" />
                ) : (
                   <i className={`fas ${isPdf ? 'fa-file-pdf' : isVideo ? 'fa-play' : isPhoto ? 'fa-image' : 'fa-external-link-alt'} text-4xl md:text-5xl opacity-80`} style={{ color: data.color || '#ffffff' }}></i>
                )}
             </div>
             
             <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight relative z-10">{data.title}</h2>
             <div className="w-16 h-1 rounded-full mb-6 relative z-10" style={{ backgroundColor: data.color || '#4da6ff', opacity: 0.6 }}></div>
             
             {data.description ? (
                <p className="text-sm md:text-base text-white/70 max-w-2xl mb-10 leading-relaxed font-light relative z-10 whitespace-pre-wrap px-4">
                   {data.description}
                </p>
             ) : (
                <p className="text-sm md:text-base text-white/40 max-w-2xl mb-10 leading-relaxed font-light relative z-10">
                   Click below to view the full details and live media for this project.
                </p>
             )}
             
             {data.link && (
               <a 
                 href={data.link} 
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
            {isWeb && data.link && <iframe src={data.link} className="w-full h-full border-none" title={data.title} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />}
            {isVideo && data.link && <iframe src={getYouTubeEmbedUrl(data.link) || data.link} className="w-full h-full border-none bg-black" allowFullScreen />}
            {isPdf && finalPdfUrl && <iframe src={`${finalPdfUrl}#toolbar=0`} className="w-full h-full border-none bg-[#323639]" title={data.title} />}
            
            {isPhoto && finalImageUrl && (
                <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8 bg-[#111111]">
                  <img src={finalImageUrl} draggable="false" className="w-full h-full object-contain rounded shadow-2xl select-none pointer-events-none" alt={data.title} />
                  <div className="absolute inset-0 z-10 bg-transparent"></div>
                </div>
            )}

            {((isWeb || isVideo || isPdf || isPhoto) && !finalPdfUrl && !data.link && !finalImageUrl) && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-white">
                  <i className={`fas ${isPdf ? 'fa-file-pdf' : isWeb ? 'fa-code' : 'fa-video'} text-6xl mb-6 opacity-20`}></i>
                  <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
                  <p className="max-w-md text-sm text-white/40">File or Link not uploaded yet.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* 💡 UNIVERSAL DESCRIPTION BOTTOM BAR (Hides for websites & external media to save space) */}
      {(!isWeb && !data.isExternalMedia) && (
        <div className="w-full bg-[#1a1a1c] border-t border-white/10 p-4 md:p-6 flex flex-col justify-center z-20 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-white text-base md:text-lg font-bold tracking-wide">{data.title}</h3>
          {data.description && <p className="text-white/60 text-xs md:text-sm mt-1.5 leading-relaxed font-light max-w-4xl">{data.description}</p>}
        </div>
      )}

    </div>
  );
}

// --- 4. MAIN OS COMPONENT ---
export default function VisionOSPortfolio() {
  const router = useRouter(); 
  
  const [time, setTime] = useState("");
  const [openWindows, setOpenWindows] = useState<AppWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [maximizedWindows, setMaximizedWindows] = useState<string[]>([]);
  const [initialAutoOpenDone, setInitialAutoOpenDone] = useState(false);
  
  const [lifePathData, setLifePathData] = useState<LifeNode[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); 
  
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingSanity, setIsLoadingSanity] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [showBootScreen, setShowBootScreen] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('hasBooted') === 'true') {
      setShowBootScreen(false);
      setBootProgress(100);
    }
  }, []);

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
  }, []);

  useEffect(() => {
    if (!showBootScreen || bootProgress >= 100) return;
    const duration = 1500; 
    const interval = 20;
    const step = (100 / (duration / interval));

    const timer = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [showBootScreen, bootProgress]);

  // 💡 THE MISSING UNLOCK COMMAND (Fixes Boot Screen Freeze)
  useEffect(() => {
    if (bootProgress >= 100 && showBootScreen) {
      const timeout = setTimeout(() => {
        setShowBootScreen(false);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('hasBooted', 'true');
        }
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [bootProgress, showBootScreen]);

  useEffect(() => {
    const fetchSanityData = async () => {
      const query = `{
        "profile": *[_type == "profile"][0]{
          name, fullName, role, location, company, github, linkedin, email, whatsapp, instagram,
          "profileImage": profileImage.asset->url
        },
        "categories": *[_type == "category"]{ title, description, info, color, icon, skillsList[]{skillName, percentage}, "id": slug.current, "parentId": parent->slug.current },
        "projects": *[_type == "project"]{ 
          title, description, projectType, link, color, showExternalLink, isExternalMedia,
          "id": slug.current, "categoryId": category->slug.current, 
          "coverUrl": coalesce(coverImage.asset->url, uploadImage.asset->url, image.asset->url),
          "contentImageUrl": coalesce(uploadImage.asset->url, image.asset->url),
          "fileUrl": coalesce(uploadFile.asset->url, file.asset->url)
        }
      }`;
      try {
        const data = await client.fetch(query);
        if (data.profile) setUserProfile(data.profile);

        const nodeMap = new Map();
        data.categories.forEach((c: any) => nodeMap.set(c.id, { ...c, type: 'category', nested: [] }));
        data.projects.forEach((p: any) => {
          const projNode = { 
            id: p.id, title: p.title, description: p.description, info: p.description, 
            color: p.color || '#ffffff', type: 'project', link: p.link, 
            coverUrl: p.coverUrl, contentImageUrl: p.contentImageUrl,
            projectType: p.projectType, fileUrl: p.fileUrl, showExternalLink: p.showExternalLink,
            isExternalMedia: p.isExternalMedia
          };
          if (p.categoryId && nodeMap.has(p.categoryId)) nodeMap.get(p.categoryId).nested.push(projNode);
        });
        const roots: LifeNode[] = [];
        nodeMap.forEach(node => {
          if (node.parentId && nodeMap.has(node.parentId)) nodeMap.get(node.parentId).nested.push(node);
          else roots.push(node);
        });
        
        roots.sort((a, b) => {
          const aIsAbout = a.id.toLowerCase().includes('about');
          const bIsAbout = b.id.toLowerCase().includes('about');
          if (aIsAbout && !bIsAbout) return -1;
          if (!aIsAbout && bIsAbout) return 1;
          return 0; 
        });

        setLifePathData(roots);
      } catch (err) { console.error(err); } finally { setIsLoadingSanity(false); }
    };
    fetchSanityData();
  }, []);

  const openApp = (data: LifeNode) => {
    if (!openWindows.find(w => w.id === data.id)) setOpenWindows([...openWindows, { id: data.id, title: data.title, data }]);
    setMinimizedWindows(minimizedWindows.filter(id => id !== data.id));
    setActiveWindowId(data.id);
  };

  useEffect(() => {
    if (lifePathData.length > 0 && !initialAutoOpenDone && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const targetFolderId = params.get('folder'); 

      if (targetFolderId) {
        const findFolderDeep = (nodes: LifeNode[]): LifeNode | undefined => {
          for (const node of nodes) {
            if (node.id === targetFolderId) return node; 
            if (node.nested && node.nested.length > 0) {
              const foundInside = findFolderDeep(node.nested); 
              if (foundInside) return foundInside;
            }
          }
          return undefined;
        };

        const folderToOpen = findFolderDeep(lifePathData);
        if (folderToOpen) {
          openApp(folderToOpen);
        }
      }
      setInitialAutoOpenDone(true);
    }
  }, [lifePathData, initialAutoOpenDone]);

  const closeApp = (id: string) => {
    setOpenWindows(openWindows.filter(w => w.id !== id));
    setMinimizedWindows(minimizedWindows.filter(w => w !== id));
    setMaximizedWindows(maximizedWindows.filter(w => w !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };
  const minimizeApp = (id: string) => { setMinimizedWindows([...minimizedWindows, id]); setActiveWindowId(null); };
  const toggleMaximize = (id: string) => {
    if (maximizedWindows.includes(id)) setMaximizedWindows(maximizedWindows.filter(w => w !== id));
    else setMaximizedWindows([...maximizedWindows, id]);
  };

  const workFolders = lifePathData.filter(f => !f.id.toLowerCase().includes('about'));
  const totalProjects = workFolders.reduce((sum, folder) => sum + (folder.nested?.length || 0), 0);

  const handleOpenSystem = () => {
    const aboutFolder = lifePathData.find(f => f.id.toLowerCase().includes('about'));
    if (aboutFolder) openApp(aboutFolder);
  };

  const handleOpenTelemetry = () => {
    const telemetryNode: LifeNode = {
      id: 'system-telemetry',
      title: 'System Diagnostics',
      description: 'Active Application Metrics',
      info: `Scanning local directory structures... Found ${totalProjects} total entities.`,
      type: 'category',
      color: '#27C93F',
      icon: 'fa-terminal',
      nested: workFolders.map(f => ({
          ...f,
          count: f.nested?.length || 0 
      } as any)) 
    };
    openApp(telemetryNode);
  };

  const dockLinks = [
    ...(userProfile?.github ? [{ icon: 'fa-github', b: true, l: userProfile.github, color: 'group-hover:text-white' }] : []),
    ...(userProfile?.linkedin ? [{ icon: 'fa-linkedin-in', b: true, l: userProfile.linkedin, color: 'group-hover:text-[#0077B5]' }] : []),
    ...(userProfile?.instagram ? [{ icon: 'fa-instagram', b: true, l: userProfile.instagram, color: 'group-hover:text-[#E1306C]' }] : []),
    ...(userProfile?.whatsapp ? [{ icon: 'fa-whatsapp', b: true, l: `https://wa.me/${userProfile.whatsapp.replace(/[^0-9]/g, '')}`, color: 'group-hover:text-[#25D366]' }] : []),
    ...(userProfile?.email ? [{ icon: 'fa-envelope', b: false, l: `mailto:${userProfile.email}`, color: 'group-hover:text-[#EA4335]' }] : []),
  ];

  const FolderItem = ({ folder }: { folder: LifeNode }) => (
    <div key={folder.id} onDoubleClick={() => !isMobile && openApp(folder)} onClick={() => isMobile && openApp(folder)} className="flex flex-col items-center gap-2 md:gap-3 cursor-pointer group w-full col-span-1 relative">
      {!isMobile && (
         <div className="absolute -top-8 bg-black/90 text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-1000 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10">
            Double-click to open
         </div>
      )}

      <div className={`w-[4.5rem] h-[4.5rem] md:w-24 md:h-24 rounded-[1.2rem] md:rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md transition-all group-hover:bg-white/15 relative overflow-hidden shadow-2xl`}>
         <div className="absolute inset-0 opacity-30 blur-2xl transition-opacity" style={{ backgroundColor: folder.color || '#4da6ff' }}></div>
         <i className={`fas ${folder.icon || 'fa-folder'} text-3xl md:text-5xl drop-shadow-lg relative z-10 transition-transform duration-300 group-hover:scale-110`} style={{ color: folder.color || '#ffffff' }}></i>
      </div>
      <span className="text-[10px] md:text-sm font-medium text-white/90 text-center leading-tight truncate w-full px-1 drop-shadow-md">{folder.title}</span>
    </div>
  );

  return (
    <main onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} className="fixed inset-0 w-screen h-[100dvh] overflow-hidden bg-[#030712] text-white font-sans select-none flex flex-col" style={{ WebkitTouchCallout: 'none' }}>
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none mix-blend-screen z-0 hidden md:block"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none mix-blend-screen z-0"></div>
      <div className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none mix-blend-screen z-0"></div>

      <AnimatePresence>
        {showBootScreen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[999] bg-[#030712] flex flex-col items-center justify-center pointer-events-auto"
          >
            <div className="flex flex-col items-center gap-12 -mt-16">
              <i className="fa-solid fa-s text-white text-6xl md:text-7xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"></i>
              <div className="w-48 md:w-56 h-[3px] bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  style={{ width: `${bootProgress}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-0 pointer-events-none"><Canvas camera={{ position: [0, 0, 5], fov: 45 }}><SpatialBackground /></Canvas></div>

      <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
        <header className="w-full h-10 flex items-center justify-between px-6 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/10 z-[200] pointer-events-auto shadow-md flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] overflow-hidden">
              {userProfile?.profileImage ? <img src={userProfile.profileImage} className="w-full h-full object-cover" /> : <span className="text-[#030712] text-[11px] font-black">S</span>}
            </div>
            <span className="text-sm font-semibold tracking-wide truncate max-w-[150px]">{userProfile?.name || "Shabbir Shakir"}</span>
            <span className="text-xs font-medium text-white/40 px-3 border-l border-white/10 uppercase hidden sm:block">
              {activeWindowId ? activeWindowId : 'Finder'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-white/80">
            <i className="fas fa-wifi text-sm"></i>
            <i className="fas fa-battery-full text-white text-sm"></i>
            <span className="tracking-wider">{time}</span>
          </div>
        </header>

        <div className="flex-1 relative p-6 md:p-8 pointer-events-auto overflow-hidden">
          {isMobile ? (
            <div className="w-full h-full overflow-y-auto pb-32 flex flex-col gap-5 pt-2 custom-scrollbar">
              <div className="grid grid-cols-4 gap-y-6 gap-x-2 px-1">
                 {lifePathData.map((folder) => <FolderItem key={folder.id} folder={folder} />)}
              </div>
              <div className="px-1 mt-2">
                 <WidgetSystem profile={userProfile} handleOpenSystem={handleOpenSystem} />
              </div>
              <div className="grid grid-cols-2 gap-3 px-1 mt-2">
                 <WidgetCalendar className="h-36" />
                 <WidgetTelemetry totalProjects={totalProjects} workFolders={workFolders} handleOpenTelemetry={handleOpenTelemetry} className="h-36" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col flex-wrap content-start max-h-[75vh] gap-8">
                {lifePathData.map((folder) => (
                   <div key={folder.id} className="w-32">
                     <FolderItem folder={folder} />
                   </div>
                ))}
              </div>
              <div className="absolute top-6 right-6 flex flex-col gap-6 z-[5] w-[24rem] select-none opacity-90 hover:opacity-100 transition-opacity duration-500">
                <div className="grid grid-cols-2 gap-4">
                   <WidgetCalendar className="aspect-square w-full" />
                   <WidgetTelemetry totalProjects={totalProjects} workFolders={workFolders} handleOpenTelemetry={handleOpenTelemetry} className="aspect-square w-full" />
                </div>
                <WidgetSystem profile={userProfile} handleOpenSystem={handleOpenSystem} />
                <WidgetMusic />
              </div>
            </>
          )}

          <AnimatePresence>
            {openWindows.map((window) => {
              const isMinimized = minimizedWindows.includes(window.id);
              const isMax = maximizedWindows.includes(window.id);
              const isAboutApp = window.id.toLowerCase().includes('about');
              const isProjectApp = window.data.type === 'project';
              
              const winRawType = (window.data.projectType || "website").toLowerCase();
              const winIsVideo = winRawType.includes("video") || winRawType.includes("film") || winRawType.includes("movie");
              const winIsPdf = winRawType.includes("pdf") || winRawType.includes("document");
              const winIsPhoto = winRawType.includes("photo") || winRawType.includes("poster") || winRawType.includes("image");
              const isWebProject = isProjectApp && !winIsVideo && !winIsPhoto && !winIsPdf;

              return (
                <motion.div
                  key={window.id}
                  initial={isMobile ? { opacity: 0, y: 100 } : { opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: isMinimized ? 0 : 1,
                    scale: isMinimized ? 0.3 : 1,
                    y: isMinimized ? 300 : 0, 
                    width: isMax ? '100%' : (isMobile ? '100%' : 850),
                    height: isMax ? '100%' : (isMobile ? 'calc(100dvh - 40px)' : 550),
                    top: isMax ? 0 : (isMobile ? 0 : 40),
                    left: isMax ? 0 : (isMobile ? 0 : 200),
                  }}
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  drag={!isMax && !isMobile && !isMinimized}
                  dragMomentum={false} 
                  onPointerDown={() => setActiveWindowId(window.id)}
                  className={`absolute flex flex-col overflow-hidden border shadow-2xl z-[40] ${isMax || isMobile ? 'rounded-none border-0' : 'rounded-2xl'}`}
                  style={{ 
                    backgroundColor: "rgba(10, 15, 30, 0.85)", backdropFilter: "blur(40px)", borderColor: "rgba(255,255,255,0.15)",
                    pointerEvents: isMinimized ? "none" : "auto" 
                  }}
                >
                  <div className={`w-full flex items-center justify-between px-4 md:px-6 border-b border-white/10 bg-[#1a1a1c]/90 backdrop-blur-md relative group/header z-50 h-14 ${!isMobile && !isMax ? 'cursor-grab active:cursor-grabbing' : ''} flex-shrink-0`}>
                    <div className="flex items-center gap-3 w-24 md:w-32 z-[60] pointer-events-auto">
                      {isMobile ? (
                        <button onClick={(e) => { e.stopPropagation(); closeApp(window.id); }} className="flex items-center gap-1.5 text-blue-400 font-semibold text-sm">
                          <i className="fas fa-chevron-left text-xs"></i><span>Back</span>
                        </button>
                      ) : (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); closeApp(window.id); }} className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-black/20 flex items-center justify-center group shadow-sm"><i className="fas fa-times text-[8px] text-black opacity-0 group-hover:opacity-100"></i></button>
                          <button onClick={(e) => { e.stopPropagation(); minimizeApp(window.id); }} className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-black/20 flex items-center justify-center group shadow-sm"><i className="fas fa-minus text-[8px] text-black opacity-0 group-hover:opacity-100"></i></button>
                          <button onClick={(e) => { e.stopPropagation(); toggleMaximize(window.id); }} className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-black/20 flex items-center justify-center group shadow-sm"><i className="fas fa-expand-alt text-[8px] text-black opacity-0 group-hover:opacity-100"></i></button>
                        </>
                      )}
                    </div>
                    
                    <div className="flex-1 flex justify-center items-center">
                      {isProjectApp ? (
                        <div className="flex items-center pointer-events-auto">
                          <div className="px-4 py-1.5 rounded-md bg-black/50 border border-white/5 text-[10px] md:text-[11px] font-medium tracking-wide text-white/60 flex items-center gap-2 max-w-[150px] md:max-w-sm overflow-hidden">
                            <i className="fas fa-lock text-[9px] opacity-50 flex-shrink-0"></i>
                            <span className="truncate">{window.title}</span>
                          </div>
                          
                          {isWebProject && window.data.description && (
                            <div className="relative group/info outline-none ml-2" tabIndex={0}>
                              <button className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-white/10 transition-colors focus:outline-none">
                                <i className="fas fa-info-circle text-[10px] text-white/50 group-focus-within/info:text-white transition-colors"></i>
                              </button>
                              
                              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 md:w-80 p-4 bg-[#1a1a1c]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-focus-within/info:opacity-100 group-focus-within/info:visible transition-all z-[100] pointer-events-auto origin-top scale-95 group-focus-within/info:scale-100 cursor-default">
                                <h4 className="text-white text-xs font-bold mb-1.5">{window.title}</h4>
                                <p className="text-white/60 text-[10px] md:text-xs leading-relaxed whitespace-pre-wrap">{window.data.description}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs md:text-sm font-bold tracking-widest text-white/90 uppercase truncate">{window.title}</span>
                      )}
                    </div>

                    <div className="w-24 md:w-32 flex justify-end items-center gap-3">
                      {window.data.showExternalLink && window.data.link && !window.data.isExternalMedia && (
                        <a 
                          href={window.data.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/5 transition-all group/link"
                          title="Open in new tab"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="fas fa-external-link-alt text-[9px] text-white/70 group-hover/link:text-white"></i>
                        </a>
                      )}
                      {isProjectApp && !isMobile && <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30 border border-white/10 px-2 py-1 rounded">{window.data.projectType || "APP"}</span>}
                    </div>
                  </div>
                  
                  <div className={`flex-1 overflow-x-hidden overflow-y-auto overscroll-contain touch-pan-y custom-scrollbar flex flex-col ${isAboutApp || isProjectApp ? '' : 'p-6 md:p-8 gap-6 pb-36 md:pb-16'}`}>
                    
                    {window.id === 'system-telemetry' ? (
                       <div className="flex flex-col gap-8 w-full h-full">
                          <div className="bg-black/30 border border-[#27C93F]/30 p-6 rounded-2xl flex flex-col gap-4 shadow-inner">
                             <h3 className="text-[#27C93F] font-bold tracking-widest uppercase text-[10px] flex items-center gap-2"><i className="fas fa-terminal"></i> Diagnostic Terminal</h3>
                             <div className="text-white/80 font-mono text-xs md:text-sm leading-relaxed whitespace-pre-line">
                               {`> ${window.data.info}
> Connecting to PHS Intranet... SUCCESS.
> Checking Barwani local grid... ALL SYSTEMS NOMINAL.
> Executing N8N Webhooks... 4 ACTIVE.
> Apps Script quota check... WARNING: APPROACHING LIMIT.
> Initializing Lisan-ud-Dawat font protocols... LOADED.
> Coffee levels... CRITICAL. REFILL REQUIRED.`}
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                             {window.data.nested?.map((statItem: any, idx: number) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center justify-center relative overflow-hidden group hover:bg-white/10 transition-all">
                                   <div className="absolute inset-0 opacity-10" style={{ backgroundColor: statItem.color }}></div>
                                   <i className={`fas ${statItem.icon} text-3xl mb-4 opacity-50 transition-opacity group-hover:opacity-100 group-hover:scale-110 duration-300`} style={{ color: statItem.color }}></i>
                                   <span className="text-4xl md:text-5xl font-light text-white mb-2">{statItem.count}</span>
                                   <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{statItem.title}</span>
                                </div>
                             ))}
                          </div>
                       </div>
                    ) : isProjectApp ? (
                      <ProjectViewerApp data={window.data} />
                    ) : isAboutApp ? (
                      <AboutMeApp data={window.data} profile={userProfile} />
                    ) : (
                      <>
                        {(window.data.info || (window.data.skillsList && window.data.skillsList.length > 0)) && (
                           <div className="mb-6 bg-black/20 p-5 rounded-2xl border border-white/5 shadow-inner">
                              {window.data.info && <p className="text-sm md:text-base text-white/80 font-light leading-relaxed">{window.data.info}</p>}
                              
                              {window.data.skillsList && window.data.skillsList.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/5">
                                  {window.data.skillsList.map((skill, idx) => (
                                    <div key={idx}>
                                      <div className="flex justify-between text-[10px] font-bold text-white/60 mb-2 uppercase tracking-wider"><span>{skill.skillName}</span><span style={{ color: window.data.color }}>{skill.percentage}%</span></div>
                                      <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5"><div className="h-full rounded-full transition-all duration-1000" style={{ width: `${skill.percentage}%`, backgroundColor: window.data.color || '#ffffff' }}></div></div>
                                    </div>
                                  ))}
                                </div>
                              )}
                           </div>
                        )}

                        {window.data.nested && window.data.nested.length > 0 && (
                          <div className="flex flex-col gap-4 mt-2">
                            <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-[10px] font-bold border-b border-white/10 pb-3">
                               <i className="fas fa-folder-open"></i>
                               <span>Directory Contents ({window.data.nested.length} Items)</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 pt-2">
                              {window.data.nested.map((proj) => {
                                const isFolder = proj.type === 'category'; 
                                
                                let BadgeIcon = "fa-compass"; let BadgeColor = "bg-blue-500";
                                if (isFolder) {
                                   BadgeIcon = "fa-folder-open"; BadgeColor = "bg-gray-600";
                                } else {
                                   const rawType = (proj.projectType || "").toLowerCase();
                                   if (rawType.includes("video") || rawType.includes("movie")) { BadgeIcon = "fa-play"; BadgeColor = "bg-red-500"; }
                                   else if (rawType.includes("pdf") || rawType.includes("doc") || proj.fileUrl) { BadgeIcon = "fa-file-pdf"; BadgeColor = "bg-orange-500"; }
                                   else if (rawType.includes("photo") || rawType.includes("image") || proj.contentImageUrl) { BadgeIcon = "fa-image"; BadgeColor = "bg-purple-500"; }
                                }

                                const displayImage = proj.coverUrl;

                                return (
                                  <div key={proj.id} onClick={(e) => { 
                                     e.stopPropagation(); 
                                     if (isFolder) openApp(proj);
                                     else router.push(`/demo/${proj.id}`); 
                                  }} className="flex flex-col items-center gap-4 cursor-pointer group">
                                    <div className="relative">
                                      <div className="w-24 h-24 md:w-20 md:h-20 rounded-3xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-white/15 overflow-hidden active:scale-95 shadow-xl relative">
                                        {isFolder ? (
                                           <>
                                             <div className="absolute inset-0 opacity-20" style={{ backgroundColor: proj.color }}></div>
                                             <i className={`fas ${proj.icon || 'fa-folder'} text-3xl`} style={{ color: proj.color || '#ffffff' }}></i>
                                           </>
                                        ) : displayImage ? (
                                           <img src={displayImage} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100" /> 
                                        ) : (
                                           <i className="fas fa-file-code text-4xl text-white/60"></i>
                                        )}
                                      </div>
                                      <div className={`absolute -bottom-2 -right-2 w-8 h-8 md:w-7 md:h-7 ${BadgeColor} border-2 border-[#1a1a1c] rounded-full flex items-center justify-center shadow-lg z-20`}>
                                         <i className={`fas ${BadgeIcon} text-xs md:text-[10px] text-white ml-[1px]`}></i>
                                      </div>
                                    </div>
                                    <span className="text-xs font-medium text-white/80 text-center leading-tight line-clamp-2 w-full px-1">{proj.title}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-5 px-4 md:px-6 py-3 md:py-4 bg-[#1a1a1c]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] z-[100] pointer-events-auto shadow-2xl">
          {openWindows.map(app => {
            let dockIcon = app.data.icon || 'fa-folder';
            if (app.data.type === 'project') {
               const rawType = (app.data.projectType || "").toLowerCase();
               if (rawType.includes("video") || rawType.includes("movie")) dockIcon = "fa-file-video";
               else if (rawType.includes("pdf")) dockIcon = "fa-file-pdf";
               else if (rawType.includes("photo") || rawType.includes("image")) dockIcon = "fa-file-image";
               else dockIcon = "fa-compass";
            }
            return (
              <button key={app.id} onClick={(e) => { e.stopPropagation(); openApp(app.data); }} className="relative group flex flex-col items-center pointer-events-auto">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg relative overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundColor: app.data.color }}></div>
                  <i className={`fas ${dockIcon} text-2xl md:text-3xl`} style={{ color: app.data.color || '#ffffff' }}></i>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full mt-2 transition-all ${minimizedWindows.includes(app.id) ? 'bg-white/30' : (activeWindowId === app.id ? 'bg-white' : 'bg-white/60')}`}></div>
              </button>
            )
          })}
          {openWindows.length > 0 && dockLinks.length > 0 && <div className="w-px h-10 bg-white/10 mx-2"></div>}
          
          {dockLinks.map((item, idx) => (
            <a key={idx} href={item.l} target="_blank" className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:scale-110 pointer-events-auto group shadow-md relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity"></div>
              <i className={`${item.b ? 'fab' : 'fas'} ${item.icon} text-2xl md:text-3xl text-white/80 transition-colors ${item.color}`}></i>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}