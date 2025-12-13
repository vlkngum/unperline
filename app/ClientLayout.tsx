"use client";

import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import React from "react";
import { SessionProvider, useSession } from "next-auth/react";
import Header from "./components/Header";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AppContent>{children}</AppContent>
    </SessionProvider>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProfilePage = pathname?.startsWith("/p/");
  const isWidePage = pathname === "/members" || pathname === "/connect";
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = session?.user ? {
    name: session.user.name || session.user.email || '',
    avatar: (session.user as any).image || undefined
  } : null;

  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans mx-auto text-white min-h-screen antialiased relative overflow-hidden`}
      >
        {!isAuthPage && (
          <div className="fixed inset-0 -z-10 selection:bg-indigo-500/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f172a]/20 to-black"></div>

            <div className="absolute w-64 h-64 bg-blue-600 rounded-full opacity-10 blur-3xl animate-move1 top-10 left-20"></div>
            <div className="absolute w-48 h-48 bg-blue-600 rounded-full opacity-10 blur-2xl animate-move2 top-1/2 left-1/3"></div>
            <div className="absolute w-72 h-72 bg-blue-600 rounded-full opacity-10 blur-3xl animate-move3 top-3/4 left-2/3"></div>
          </div>
        )}


        <div className="flex flex-col min-h-screen relative z-10">
          {!isAuthPage && (
            <div className="from-[#101010] via-[#101010]/60 to-transparent bg-gradient-to-b backdrop-blur-sm z-50">
              <Header user={user} />
            </div>
          )}

<main className={`flex-1 ${isProfilePage ? 'w-full' : isWidePage ? 'w-full mx-auto px-4' : 'max-w-7xl mx-auto px-4'}`}>
            {children}
          </main>

          {!isAuthPage && (
            <footer className="h-12 border-t border-neutral-800 flex items-center justify-center text-sm text-neutral-500 mx-auto px-10">
              {new Date().getFullYear()} Unperline
            </footer>
          )}
        </div>


      </body>
    </html>
  );
}
