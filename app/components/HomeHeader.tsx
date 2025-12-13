"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
// Import yolunu kendi yapına göre düzeltirsin
import AuthModal from "./AuthModal"; 

interface HomeHeaderProps {
  currentUser?: any;
}

export default function HomeHeader({ currentUser }: HomeHeaderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // Modal açılırken hangi modda (login/register) açılacağını tutmak için:
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const { data: session } = useSession();

  const sessionUser = session?.user;
  const user = currentUser || sessionUser;

  // Modal açma yardımcısı
  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
          Hoş geldin,{" "}
          <span className="text-[#40bcf4]">
            {user.name || user.email || "Okur"}
          </span>
          .
        </h1>
        <p className="text-gray-400 mt-4 text-lg">Bugün ne okumak istersin?</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-[550px] md:h-[650px] overflow-hidden group">
        
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] group-hover:scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1517770413964-df8ca61194a6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dfit=crop')",
            filter: "brightness(0.4)" 
          }}
        />
        
        <div 
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            backdropFilter: "blur(0px)",
            WebkitBackdropFilter: "blur(0px)",
            background: "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%)",
            boxShadow: "inset 0 0 200px 60px rgba(0,0,0,0.6)"
          }}
        />
      
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
          <div className="space-y-2 md:space-y-4 font-bold text-white drop-shadow-2xl opacity-90">
            <h2 className="text-3xl md:text-5xl leading-tight">
              Okuduğun kitapları takip et.
            </h2>
            <h2 className="text-3xl md:text-5xl leading-tight text-gray-200">
              Okumak istediklerini kaydet.
            </h2>
            <h2 className="text-3xl md:text-5xl leading-tight text-gray-300">
              Arkadaşlarına neyin iyi olduğunu söyle.
            </h2>
          </div>

          <p className="mt-8 text-gray-300 max-w-2xl text-lg font-light hidden md:block drop-shadow-lg">
            Kitap severler için sosyal ağ. Hayatını kitaplarla kurgula.
          </p>

          <button
            onClick={() => openAuthModal("register")}
            className="mt-10 bg-[#1600c0] hover:bg-[#1300e0] text-white cursor-pointer font-bold py-3 px-10 rounded shadow-lg uppercase tracking-widest text-sm transition-all transform hover:scale-105"
          >
            Hemen Başla — Ücretsiz!
          </button>
        </div>
      </div>

      {/* MODAL ARTIK BURADA ÇAĞIRILIYOR */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}