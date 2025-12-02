"use client";

import { useState } from "react";

interface HomeHeaderProps {
  currentUser?: any;
}

export default function HomeHeader({ currentUser }: HomeHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
          Hoş geldin, <span className="text-[#40bcf4]">{currentUser.name}</span>.
        </h1>
        <p className="text-gray-400 mt-4 text-lg">Bugün ne okumak istersin?</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="relative w-full h-[550px] md:h-[650px] overflow-hidden group">
        
        {/* Arka plan görseli - karartılmış */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] group-hover:scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1517770413964-df8ca61194a6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dfit=crop')",
            filter: "brightness(0.4)" 
          }}
        />
        
        {/* Kenarları bulanıklaştıran katman - vignette efekti */}
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
          <div className="space-y-2 md:space-y-4 font-serif font-bold text-white drop-shadow-2xl">
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
            onClick={() => setIsOpen(true)}
            className="mt-10 bg-[#00c030] hover:bg-[#00e054] text-white font-bold py-3 px-10 rounded shadow-lg uppercase tracking-widest text-sm transition-all transform hover:scale-105"
          >
            Hemen Başla — Ücretsiz!
          </button>
        </div>
      </div>
 
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#14181c] border border-gray-700 rounded-lg p-8 shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            <div className="flex justify-center mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center mt-6">Unperline'a Katıl</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">E-Posta</label>
                <input type="email" className="w-full p-3 bg-[#2c3440] border border-transparent focus:border-white rounded text-white focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Şifre</label>
                <input type="password" className="w-full p-3 bg-[#2c3440] border border-transparent focus:border-white rounded text-white focus:outline-none transition-colors" />
              </div>
              <button className="w-full bg-[#00c030] hover:bg-[#00e054] text-white font-bold py-3 rounded mt-4 uppercase tracking-widest text-sm transition-colors">
                Giriş Yap
              </button>
            </div>
            <p className="text-center text-gray-500 text-sm mt-6 cursor-pointer hover:text-white">Şifreni mi unuttun?</p>
          </div>
        </div>
      )}
    </>
  );
}