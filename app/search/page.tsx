import BookCard from "@/app/components/book/BookCard";
import { use } from "react"; 
import { Suspense } from "react";
import BookListItem from "../components/book/BookListItem";

async function getSearchResults(query: string) {
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`,
    { next: { revalidate: 0 } } 
  );
  return res.json();
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || "";

  const data = query ? await getSearchResults(query) : { items: [] };
  const books = data.items || [];

  return (
    <main className="min-h-screen py-6 text-white  w-full">
      <h1 className="text-3xl font-bold mb-6">Search results for "{query}"</h1>

      {books.length === 0 && <p>No results found.</p>}

      <div className="flex flex-col gap-4">
        {books.map((book: any) => (
          <BookListItem key={book.id} book={book} />
        ))}
      </div>

    </main>
  );
}
