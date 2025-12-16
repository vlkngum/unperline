"use client";

import { GoogleBooksResponse, Book } from "../../types/book";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Pencil } from "lucide-react";
import BookCategoryRow from "../../components/book/BookCategory";

const FAVORITE_IDS = [
  "zyTCAlFPjgYC",
  "m8dPPgAACAAJ",
  "yZ1VDwAAQBAJ",
  "uW8oEAAAQBAJ",
  "eLRhEAAAQBAJ",
];

const RECENT_IDS = [
  "1wy49i-gQjIC",
  "xv8sAAAAYAAJ",
  "uW8oEAAAQBAJ",
  "tQ8IAQAAMAAJ",
  "m8dPPgAACAAJ",
];

async function fetchBookById(id: string): Promise<Book | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchBooksByIds(ids: string[]): Promise<Book[]> {
  const results = await Promise.all(ids.map(fetchBookById));
  return results.filter(Boolean) as Book[];
}

type ProfileStats = { books: number; followers: number; following: number };

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

function ProfileHeader({
  profileId,
  isOwner,
  bannerUrl,
  profileImage,
  stats,
  description,
  editHref,
}: {
  profileId: string;
  isOwner: boolean;
  bannerUrl: string;
  profileImage: string;
  stats: ProfileStats;
  description?: string;
  editHref?: string;
}) {
  return (
    <header className="border-b border-white/10 w-full relative">
      <div className="relative w-full">
        {/* Banner */}
        <div className="h-48 md:h-96 w-full  overflow-hidden ring-1 ring-white/5 shadow-2xl absolute top-0 ">
          <Image
            src={bannerUrl}
            alt="banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Avatar + info */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6 -mt-12 md:-mt-16 relative z-10 ">
            <div className="pt-64">
              <Image
                src={profileImage}
                alt="Avatar"
                width={144}
                height={144}
                className="w- object-cover w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl bg-neutral-800 flex-shrink-0"
              />
            </div>

          <div className="flex-1 flex flex-col md:flex-row md:items-end md:justify-between gap-4 w-full">
            <div className="space-y-2 flex-1">
              <h1 className="text-2xl md:text-3xl font-semibold text-white">
                {profileId}
              </h1>
            </div>

            <div className="flex gap-6 text-sm text-gray-300 md:ml-auto">
              <span>
                <b className="text-white">{stats.books}</b> Kitap
              </span>
              <span>
                <b className="text-white">{stats.followers}</b> Takipçi
              </span>
              <span>
                <b className="text-white">{stats.following}</b> Takip
              </span>
            </div>

            
          </div>
          
        </div>
        <div className="w-full flex justify-between">
         <div className="flex-1 w-xl flex justify-start items-center ">
            {description && (
                <p className="text-gray-400 text-sm md:text-base max-w-2xl">
                  {description}
                </p>
              )}
            </div>
        {/* Düzenleme butonu ayrı sayfaya yönlendiriyor */}
        {isOwner && editHref && (
          <Link
            href={editHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-100 transition shadow-md"
          >
            <Pencil size={16} />
            <span>Profili Düzenle</span>
          </Link>
        )}
        </div>
        
      </div>
    </header>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const profileId = params?.id?.toString() || "profil";
  const { data: session } = useSession();
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab] = useState("overview");
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const isOwner = useMemo(() => {
    const sessionName = session?.user?.name?.toString().toLowerCase();
    const sessionEmail = session?.user?.email?.toString().toLowerCase();
    const pid = profileId.toLowerCase();
    return !!session && (sessionName === pid || sessionEmail?.split("@")[0] === pid);
  }, [session, profileId]);

  // Google Books vitrin verileri
  useEffect(() => {
    async function load() {
      setLoading(true);
      const [favorites, recent] = await Promise.all([
        fetchBooksByIds(FAVORITE_IDS),
        fetchBooksByIds(RECENT_IDS),
      ]);
      setFavoriteBooks(favorites);
      setRecentBooks(recent);
      setLoading(false);
    }
    load();
  }, []);

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
  }, [session?.user?.id]);

  const tabs = [
    { id: "overview", label: "Genel Bakış", href: `/p/${encodeURIComponent(profileId)}` },
    { id: "books", label: "Kitaplar", href: `/p/${encodeURIComponent(profileId)}/books` },
    { id: "reviews", label: "İncelemeler", href: `/p/${encodeURIComponent(profileId)}/reviews` },
    { id: "likes", label: "Beğeniler", href: `/p/${encodeURIComponent(profileId)}/likes` },
  ];

  return (
    <div className="min-h-screen text-white w-full">
    <div className="max-w-6xl mx-auto w-full">
      <ProfileHeader
        profileId={profile?.username || profileId}
        isOwner={isOwner}
        bannerUrl={profile?.bannerUrl || "/dex2.jpg"}
        profileImage={profile?.avatarUrl || "/dex.png"}
        stats={{ books: 128, followers: 45, following: 32 }}
        description={
          profile?.bio ||
          "Kitap sever, okuma tutkunu. Her gün yeni bir hikaye keşfediyorum."
        }
        editHref={isOwner ? `/profile/edit` : undefined}
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

        <div className="px-4 py-8 space-y-14 w-full">
          {loading ? (
            <p className="text-gray-500">Yükleniyor…</p>
          ) : (
            <> 
              {favoriteBooks.length > 0 && (
                <BookCategoryRow
                  key="favori"
                  title="Favori Kitaplar"
                  books={favoriteBooks}
                />
              )}

          {recentBooks.length > 0 && (
                <BookCategoryRow
                  key="recent"
                  title="Son Okunanlar"
                  books={recentBooks}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}