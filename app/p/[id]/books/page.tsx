"use client";

import { Book } from "../../../types/book";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Pencil } from "lucide-react";
import BookCard from "../../../components/book/BookCard";
import Select from "react-select";

async function fetchBookById(id: string): Promise<Book | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}`
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

type ProfileData = {
  id: number;
  username: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bio?: string | null;
};

 

type SortKey = "title_asc" | "title_desc" | "date_new" | "date_old";

const SORT_OPTIONS = [
  { value: "date_new", label: "En yeni" },
  { value: "date_old", label: "En eski" },
  { value: "title_asc", label: "İsme göre (A-Z)" },
  { value: "title_desc", label: "İsme göre (Z-A)" },
];

const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "rgb(23, 23, 23)",
    borderColor: state.isFocused ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)",
    borderRadius: "0.375rem",
    padding: "0.125rem",
    minHeight: "auto",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(255, 255, 255, 0.3)" : "none",
    "&:hover": {
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "rgb(23, 23, 23)",
    borderRadius: "0.375rem",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    marginTop: "0.25rem",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "rgba(255, 255, 255, 0.1)"
      : state.isFocused
      ? "rgba(255, 255, 255, 0.05)"
      : "transparent",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "0.875rem",
    padding: "0.5rem 0.75rem",
    "&:active": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#ffffff",
    fontSize: "0.875rem",
  }),
  input: (base: any) => ({
    ...base,
    color: "#ffffff",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#9ca3af",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: "#9ca3af",
    "&:hover": {
      color: "#ffffff",
    },
  }),
};

export default function ProfileBooksPage() {
  const params = useParams();
  const profileId = params?.id?.toString() || "profil";
  const { data: session } = useSession();
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [bookRatings, setBookRatings] = useState<
    Record<
      string,
      {
        value: number;
        count?: number;
      }
    >
  >({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>("date_new");
  const [profile, setProfile] = useState<ProfileData | null>(null);

   

  useEffect(() => {
    async function load() {
      setLoading(true);
      try { 
        const res = await fetch(`/api/p/${encodeURIComponent(profileId)}/books`, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Kullanıcı kitapları yüklenemedi");
          setLoading(false);
          return;
        }

        const data = await res.json();
        const bookIds: string[] = data.readBooks || [];
        const ratings = data.bookRatings || {};
        const profileData = data.profile;

        setProfile(profileData);
        setBookRatings(ratings);

        if (bookIds.length > 0) {
          const books = await fetchBooksByIds(bookIds);
          setAllBooks(books);
        } else {
          setAllBooks([]);
        }
      } catch (error) {
        console.error("Kitaplar yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [profileId]);

  


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
                  <div className="w-48">
                    <Select
                      value={SORT_OPTIONS.find(opt => opt.value === sortBy)}
                      onChange={(option) => setSortBy(option?.value as SortKey)}
                      options={SORT_OPTIONS}
                      styles={customSelectStyles}
                      isSearchable={false}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                {sortedBooks.map((book) => (
                  <div key={book.id}>
                    <BookCard
                      book={book}
                      rating={bookRatings[book.id]}
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


