"use client";

import { Book } from "../../types/book";
import BookCard from "./BookCard";


export default function BookCategoryRow({
  title,
  books,
}: {
  title: string;
  books: Book[];
}) {
  return (
    <section className="mb-10 w-min">
      <h2 className="text-xl font-semibold mb-4 text-white px-4 lg:px-0">
        {title}
      </h2>
      <div className="relative">
        <div className="flex gap-4 py-2 px-4 lg:px-0 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-thin scroll-hidden ">
          {books.slice(0, 8).map((book) => (
            <div key={book.id} className="flex-shrink-0 w-36 snap-start">
              <BookCard book={book} />
            </div>
          ))}
        </div>

        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#141414]/80 to-transparent pointer-events-none" />
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#141414]/80 to-transparent pointer-events-none" />
      </div>
     </section>
  );
}