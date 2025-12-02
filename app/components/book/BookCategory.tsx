import BookCard from "./BookCard";

interface BookCategoryRowProps {
  title: string;
  books: any[];
}

export default function BookCategoryRow({ title, books }: BookCategoryRowProps) {
  return (
    <section className="w-full">
      <h2 className="text-xl font-semibold mb-4 text-white">
        {title}
      </h2>
      <div className="flex gap-4 py-2 overflow-x-hidden">
        {books.slice(0, 8).map((book) => (
          <div key={book.id} className="flex-shrink-0 w-36">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  );
}
