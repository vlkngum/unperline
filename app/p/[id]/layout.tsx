"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProfileHeader, { DEFAULT_PROFILE_STATS } from "../../components/profile/ProfileHeader";

type ProfileData = {
  id: number;
  username: string;
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  location?: string | null;
  bio?: string | null;
  pronouns?: string | null;
  favoriteBooks: string[];
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const profileId = params?.id?.toString() || "profil";
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const isOwner = useMemo(() => {
    const sessionName = session?.user?.name?.toString().toLowerCase();
    const sessionEmail = session?.user?.email?.toString().toLowerCase();
    const pid = profileId.toLowerCase();
    return !!session && (sessionName === pid || sessionEmail?.split("@")[0] === pid);
  }, [session, profileId]);

  // Profil verisini backend'den çek
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (!res.ok) return;
        const data: ProfileData = await res.json();
        setProfile({
          ...data,
          favoriteBooks: (data.favoriteBooks || []).slice(0, 4),
        });
      } catch (e) {
        console.error("Profil yüklenirken hata:", e);
      }
    }

    if (session?.user?.id) {
      loadProfile();
    }
  }, [session?.user?.id, pathname]); // pathname değiştiğinde de yenile

  // Sayfa focus aldığında profil verisini yenile (profile edit'ten dönünce güncellenmesi için)
  useEffect(() => {
    const handleFocus = () => {
      if (session?.user?.id) {
        async function refreshProfile() {
          try {
            const res = await fetch("/api/profile", { cache: "no-store" });
            if (!res.ok) return;
            const data: ProfileData = await res.json();
            setProfile({
              ...data,
              favoriteBooks: (data.favoriteBooks || []).slice(0, 4),
            });
          } catch (e) {
            console.error("Profil yenilenirken hata:", e);
          }
        }
        refreshProfile();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [session?.user?.id]);

  const tabs = [
    { id: "overview", label: "Genel Bakış", href: `/p/${encodeURIComponent(profileId)}` },
    { id: "books", label: "Kitaplar", href: `/p/${encodeURIComponent(profileId)}/books` },
    { id: "reviews", label: "İncelemeler", href: `/p/${encodeURIComponent(profileId)}/reviews` },
    { id: "likes", label: "Beğeniler", href: `/p/${encodeURIComponent(profileId)}/likes` },
  ];

  // Aktif tab'ı pathname'den belirle
  const currentTab = useMemo(() => {
    if (pathname?.includes("/books")) return "books";
    if (pathname?.includes("/reviews")) return "reviews";
    if (pathname?.includes("/likes")) return "likes";
    return "overview";
  }, [pathname]);

  return (
    <div className="min-h-screen text-white w-full">
      <div className="max-w-6xl mx-auto w-full">
        <ProfileHeader
          profile={{
            profileId: profile?.username || profileId,
            isOwner,
            bannerUrl: profile?.bannerUrl || "/dex2.jpg",
            profileImage: profile?.avatarUrl || "/dex.png",
            description:
              profile?.bio ||
              "Kitap sever, okuma tutkunu. Her gün yeni bir hikaye keşfediyorum.",
            editHref: isOwner ? `/profile/edit` : undefined,
          }}
        />

        <div className="border-b border-white/10 bg-neutral-950 w-full">
          <div className="px-4">
            <nav className="flex gap-1 -mb-px">
              {tabs.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                      isActive
                        ? "border-white text-white"
                        : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

