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
  stats?: {
    books: number;
    followers: number;
    following: number;
  };
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwner = useMemo(() => {
    const sessionName = session?.user?.name?.toString().toLowerCase();
    const sessionEmail = session?.user?.email?.toString().toLowerCase();
    const pid = profileId.toLowerCase();
    return !!session && (sessionName === pid || sessionEmail?.split("@")[0] === pid);
  }, [session, profileId]);

  // Profil verisini backend'den çek
  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/p/${encodeURIComponent(profileId)}/profile`, {
          cache: "no-store",
        });
        
        if (!res.ok) {
          if (res.status === 404) {
            setError("Bu kullanıcı bulunamadı");
          } else {
            setError("Profil yüklenirken bir hata oluştu");
          }
          setLoading(false);
          return;
        }
        
        const data: ProfileData = await res.json();
        setProfile({
          ...data,
          favoriteBooks: (data.favoriteBooks || []).slice(0, 4),
        });
      } catch (e) {
        console.error("Profil yüklenirken hata:", e);
        setError("Profil yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [profileId, pathname]);

  const handleFollow = async () => {
    if (!session) {
      // Giriş yapmamış kullanıcı için login sayfasına yönlendir
      return;
    }
    
    try {
      // TODO: Takip et/takipten çık API'si eklenecek
      setIsFollowing(!isFollowing);
    } catch (e) {
      console.error("Takip işlemi başarısız:", e);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen text-white w-full flex items-center justify-center">
        <p className="text-gray-500">Yükleniyor…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen text-white w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">{error || "Kullanıcı bulunamadı"}</p>
          <p className="text-gray-500 text-sm">
            <span className="font-semibold">{profileId}</span> isimli bir kullanıcı bulunamadı.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white w-full">
      <div className="max-w-6xl mx-auto w-full">
        <ProfileHeader
          profile={{
            profileId: profile.username,
            profileName: profile.fullName ?? "",
            isOwner,
            bannerUrl: profile.bannerUrl ?? "",
            profileImage: profile.avatarUrl  ?? "",
            description: profile.bio ?? "",
            editHref: isOwner ? `/profile/edit` : undefined,
            followButton: !isOwner && session ? (
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isFollowing
                    ? "bg-neutral-800 text-white border border-white/20 hover:bg-neutral-700"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {isFollowing ? "Takipten Çık" : "Takip Et"}
              </button>
            ) : undefined,
            stats: profile.stats || DEFAULT_PROFILE_STATS,
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

