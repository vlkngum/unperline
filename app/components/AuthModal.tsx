"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // 1. IMPORT ETTİK
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  // ... diğer state'lerin aynı kalsın
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 2. MOUNT KONTROLÜ (Hydration hatası almamak için)
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true); // Sayfa yüklendiğinde true yap
  }, []);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      resetForm();
      // Modal açılınca arkadaki scroll'u kitleyelim
      document.body.style.overflow = 'hidden';
    } else {
      // Kapanınca açalım
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function
    return () => {
       document.body.style.overflow = 'unset';
    }
  }, [isOpen, initialMode]);

  const resetForm = () => {
    setError("");
    setLoading(false);
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // ... buralar senin kodunla aynı ...
    e.preventDefault();
    // ... login/register işlemleri ...
    // ...
  };

  // 3. EĞER KAPALIYSA VEYA HENÜZ MOUNT OLMADIYSA GÖSTERME
  if (!isOpen || !mounted) return null;

  // 4. CREATE PORTAL İLE BODY'YE IŞINLIYORUZ
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#14181c] border border-gray-700 rounded-lg p-8 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* ... FORM İÇERİĞİ AYNI KALACAK ... */}
         <div className="flex justify-center mb-6 gap-4 mt-4">
            {/* ... butonlar vs ... */}
            {/* Senin mevcut JSX kodların buraya gelecek */}
             <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
              mode === "login"
                ? "bg-white text-black"
                : "bg-transparent text-gray-400 hover:text-white"
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
              mode === "register"
                ? "bg-white text-black"
                : "bg-transparent text-gray-400 hover:text-white"
            }`}
          >
            Kayıt Ol
          </button>
         </div>

         {/* ... Kalan form kodların ... */}
         <h2 className="text-2xl font-bold text-white mb-4 text-center mt-2">
          {mode === "login" ? "Giriş Yap" : "Unperline'a Katıl"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleAuthSubmit}>
           {/* ... inputlar ... */}
             {mode === "register" && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-[#2c3440] border border-transparent focus:border-white rounded text-white focus:outline-none transition-colors"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              {mode === "login" ? "E-Posta veya Kullanıcı Adı" : "E-Posta"}
            </label>
            <input
              type={mode === "login" ? "text" : "email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-[#2c3440] border border-transparent focus:border-white rounded text-white focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2.5 bg-[#2c3440] border border-transparent focus:border-white rounded text-white focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1600c0] hover:bg-[#1300e0] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 rounded mt-2 uppercase tracking-widest text-sm transition-colors"
          >
            {loading
              ? "Lütfen bekleyin..."
              : mode === "login"
              ? "Giriş Yap"
              : "Kayıt Ol"}
          </button>
        </form>
      </div>
    </div>,
    document.body // BU KISIM ÖNEMLİ: React bunu body'nin içine render edecek
  );
}