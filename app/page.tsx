import BookCategoryRow from "./components/book/BookCategory";
import { GoogleBooksResponse, Book } from "./types/book";

export const dynamic = "force-dynamic";

const categories = [
  { title: "Sizin İçin Önerilenler", query: "bestseller" },
  { title: "Tarih", query: "history" },
  { title: "Kült", query: "cult" },
  { title: "Film", query: "movie" },
  { title: "Türk Kültürü", query: "turkish culture" },
];

async function fetchBooks(query: string): Promise<Book[]> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;

  const res = await fetch(url, { cache: "no-store" });
  const data: GoogleBooksResponse = await res.json();

  return data.items || [];
}

export default async function HomePage() {
  const results = await Promise.all(
    categories.map((c) => fetchBooks(c.query))
  );

  return (
    <main className="px-6 py-6">
      {categories.map((cat, i) => (
        <BookCategoryRow
          key={cat.title}
          title={cat.title}
          books={results[i]}
        />
      ))}
    </main>
  );
}
