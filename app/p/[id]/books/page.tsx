"use client";

import { Book } from "../../../types/book";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Pencil } from "lucide-react";
import BookCard from "../../../components/book/BookCard";

// Statik, örnek puanlar (sonradan dinamik veriye bağlanabilir)
const STATIC_BOOK_RATINGS: Record<
  string,
  {
    value: number; // 0-5 arası puan
    count?: number; // oy sayısı (isteğe bağlı)
  }
> = {
  zyTCAlFPjgYC: { value: 4.8, count: 1245 },
  "1wy49i-gQjIC": { value: 4.2, count: 532 },
  m8dPPgAACAAJ: { value: 3.9, count: 210 },
  yZ1VDwAAQBAJ: { value: 4.5, count: 987 },
  uW8oEAAAQBAJ: { value: 4.0, count: 321 },
  eLRhEAAAQBAJ: { value: 4.7, count: 764 },
  "xv8sAAAAYAAJ": { value: 3.6, count: 89 },
  tQ8IAQAAMAAJ: { value: 4.1, count: 145 },
  "QrkEAQAAIAAJ": { value: 4.9, count: 2031 },
  OEBaEAAAQBAJ: { value: 3.8, count: 156 },
  jRvQByotUY4C: { value: 4.3, count: 102 },
};

const FAVORITE_IDS = [
  "zyTCAlFPjgYC",
  "m8dPPgAACAAJ",
  "yZ1VDwAAQBAJ",
  "uW8oEAAAQBAJ",
  "eLRhEAAAQBAJ",
  "QrkEAQAAIAAJ",
  "OEBaEAAAQBAJ",
  "PGR2AwAAQBAJ",
  "uWbFDAAAQBAJ",
  "v1o_AAAAYAAJ",
];

const RECENT_IDS = [
  "1wy49i-gQjIC",
  "xv8sAAAAYAAJ",
  "uW8oEAAAQBAJ",
  "tQ8IAQAAMAAJ",
  "m8dPPgAACAAJ",
  "WrOQLV6xB-wC",
  "bU5VAAAAYAAJ",
  "zYwYxQEACAAJ",
  "WfanDwAAQBAJ",
  "k8Z0CAAAQBAJ",
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

function ProfileHeader({
  profileId,
  isOwner,
  bannerUrl,
  profileImage,
  stats,
  description,
}: {
  profileId: string;
  isOwner: boolean;
  bannerUrl: string;
  profileImage: string;
  stats: { books: number; followers: number; following: number };
  description?: string;
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
          {isOwner && (
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-italic hover:bg-gray-100 transition shadow-md">
              <Pencil size={16} />
              <span className="font-italic">Profili Düzenle</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

type SortKey = "title_asc" | "title_desc" | "date_new" | "date_old";

export default function ProfileBooksPage() {
  const params = useParams();
  const profileId = params?.id?.toString() || "profil";
  const { data: session } = useSession();
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>("date_new");

  const isOwner = (() => {
    const sessionName = session?.user?.name?.toString().toLowerCase();
    const sessionEmail = session?.user?.email?.toString().toLowerCase();
    const pid = profileId.toLowerCase();
    return (
      !!session &&
      (sessionName === pid || sessionEmail?.split("@")[0] === pid)
    );
  })();

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

  const tabs = [
    {
      id: "overview",
      label: "Genel Bakış",
      href: `/p/${encodeURIComponent(profileId)}`,
    },
    {
      id: "books",
      label: "Kitaplar",
      href: `/p/${encodeURIComponent(profileId)}/books`,
    },
    {
      id: "reviews",
      label: "İncelemeler",
      href: `/p/${encodeURIComponent(profileId)}/reviews`,
    },
    {
      id: "likes",
      label: "Beğeniler",
      href: `/p/${encodeURIComponent(profileId)}/likes`,
    },
  ];

  const allBooks: Book[] = useMemo(() => {
    const map = new Map<string, Book>();
    [...favoriteBooks, ...recentBooks].forEach((b) => {
      if (b?.id && !map.has(b.id)) {
        map.set(b.id, b);
      }
    });
    return Array.from(map.values());
  }, [favoriteBooks, recentBooks]);

  const sortedBooks: Book[] = useMemo(() => {
    const booksCopy = [...allBooks];

    const getYear = (book: Book): number => {
      const raw = book.volumeInfo.publishedDate;
      if (!raw) return 0;
      const year = parseInt(raw.split("-")[0] || "", 10);
      return isNaN(year) ? 0 : year;
    };

    switch (sortBy) {
      case "title_asc":
        return booksCopy.sort((a, b) =>
          (a.volumeInfo.title || "").localeCompare(
            b.volumeInfo.title || "",
            "tr"
          )
        );
      case "title_desc":
        return booksCopy.sort((a, b) =>
          (b.volumeInfo.title || "").localeCompare(
            a.volumeInfo.title || "",
            "tr"
          )
        );
      case "date_old":
        return booksCopy.sort((a, b) => getYear(a) - getYear(b));
      case "date_new":
      default:
        return booksCopy.sort((a, b) => getYear(b) - getYear(a));
    }
  }, [allBooks, sortBy]);

  return (
    <div className="min-h-screen text-white w-full">
      <div className="max-w-6xl mx-auto w-full">
        <ProfileHeader
          profileId={profileId}
          isOwner={isOwner}
          bannerUrl="/dex2.jpg"
          profileImage="/dex.png"
          stats={{
            books: sortedBooks.length || allBooks.length || 128,
            followers: 45,
            following: 32,
          }}
          description="Kitap sever, okuma tutkunu. Her gün yeni bir hikaye keşfediyorum."
        />

        <div className="border-b border-white/10 bg-neutral-950 w-full">
          <div className="px-4">
            <nav className="flex gap-1 -mb-px">
              {tabs.map((tab) => {
                const isActive = tab.id === "books";
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

        <div className="px-4 py-8 space-y-8 w-full">
          {loading ? (
            <p className="text-gray-500">Kitaplar yükleniyor…</p>
          ) : sortedBooks.length === 0 ? (
            <p className="text-gray-500">Henüz kitap yok.</p>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold">Okuduğu Kitaplar</h2>
                  <span className="text-sm text-gray-400">
                    Toplam {sortedBooks.length} kitap
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Sırala:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortKey)}
                    className="bg-neutral-900 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <option value="date_new">En yeni</option>
                    <option value="date_old">En eski</option>
                    <option value="title_asc">İsme göre (A-Z)</option>
                    <option value="title_desc">İsme göre (Z-A)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                {sortedBooks.map((book) => (
                  <div key={book.id}>
                    <BookCard
                      book={book}
                      rating={STATIC_BOOK_RATINGS[book.id]}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


