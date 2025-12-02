"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface HomeHeaderProps {
  currentUser?: any;
}

export default function HomeHeader({ currentUser }: HomeHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const sessionUser = session?.user;
  const user = currentUser || sessionUser;

  const resetForm = () => {
    setError("");
    setLoading(false);
    setPassword("");
    if (mode === "register") {
      setUsername("");
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        // Register
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Kayıt başarısız");
          setLoading(false);
          return;
        }

        // Register başarılı → otomatik login
        const loginRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (loginRes?.error) {
          setError("Kayıt başarılı ama giriş başarısız, lütfen tekrar giriş yap.");
          setLoading(false);
          return;
        }
      } else { 
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          setError("E-posta veya şifre hatalı");
          setLoading(false);
          return;
        }
      }

      // Başarılı login/register
      setIsOpen(false);
      resetForm();
      router.refresh();
    } catch (err) {
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
      setLoading(false);
    }
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
            onClick={() => {
              setIsOpen(true);
              setMode("register");
            }}
            className="mt-10 bg-[#1600c0] hover:bg-[#1300e0] text-white cursor-pointer font-bold py-3 px-10 rounded shadow-lg uppercase tracking-widest text-sm transition-all transform hover:scale-105"
          >
            Hemen Başla — Ücretsiz!
          </button>
        </div>
      </div>
 

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#14181c] border border-gray-700 rounded-lg p-8 shadow-2xl">
            <button
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="flex justify-center mb-6 gap-4 mt-4">
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

            <h2 className="text-2xl font-bold text-white mb-4 text-center mt-2">
              {mode === "login" ? "Giriş Yap" : "Unperline'a Katıl"}
            </h2>

            {error && (
              <p className="text-red-500 text-sm text-center mb-3">{error}</p>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleAuthSubmit}>
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
        </div>
      )}
    </>
  );
}