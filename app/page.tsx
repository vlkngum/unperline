import BookCategoryRow from "./components/book/BookCategory";
import HomeHeader from "./components/HomeHeader";

export const dynamic = "force-dynamic";

const categories = [
  { title: "Sizin İçin Önerilenler", query: "bestseller" },
  { title: "Tarih", query: "history" },
  { title: "Roman", query: "novel" },
  { title: "Yerli Edebiyat", query: "turkish literature" },
  { title: "Savaş ve Strateji", query: "war history" },
  { title: "Bilim ve Teknoloji", query: "science technology" },
  { title: "Klasikler", query: "classic literature" },
  { title: "Felsefe ve Düşünce", query: "philosophy" },
  { title: "Psikoloji ve Kişisel Gelişim", query: "psychology self help" },
  { title: "Fantastik ve Bilim Kurgu", query: "fantasy science fiction" },
  { title: "Biyografi ve Anılar", query: "biography memoir" },
];

async function getBooksForCategory(query: string) {
  const randomIndex = Math.floor(Math.random() * 20);

  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10&startIndex=${randomIndex}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.items || [];
}

export default async function Page() {
  const currentUser = null;

  const categoryPromises = categories.map((category) =>
    getBooksForCategory(category.query)
  );

  const categoryResults = await Promise.all(categoryPromises);

  return (
    <main className="min-h-screen text-white py-6 mx-auto">
      {!currentUser && <HomeHeader currentUser={currentUser} />}

      <div className="flex flex-col gap-8 mt-8">
        {categories.map((category, index) => {
          const books = categoryResults[index];
          if (books && books.length > 0) {
            return (
              <BookCategoryRow
                key={category.title}
                title={category.title}
                books={books}
              />
            );
          }
          return null;
        })}
      </div>
    </main>
  );
}