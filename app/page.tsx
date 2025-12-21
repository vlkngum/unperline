import BookCategoryRow from "./components/book/BookCategory";
import HomeHeader from "./components/HomeHeader";
import BookCard from "./components/book/BookCard";
import Link from "next/link";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const categories = [
  { title: "Sizin İçin Önerilenler", query: "bestseller" },
  { title: "Tarih", query: "history" },
];

async function getBooksForCategory(query: string) {
  const randomIndex = Math.floor(Math.random() * 50);

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10&startIndex=${randomIndex}`,
      { cache: "no-store" }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

async function getFriendsBooks() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/friends/books`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.books || [];
  } catch (e) {
    console.error("Friends books yüklenirken hata:", e);
    return [];
  }
}

async function fetchBookById(id: string) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function Page() {
  const session = await auth();
  const currentUser = session?.user || null;

  const categoryPromises = categories.map((c) =>
    getBooksForCategory(c.query)
  );

  const [categoryResults, friendsBooksData] = await Promise.all([
    Promise.all(categoryPromises),
    getFriendsBooks(),
  ]);

  const friendsBooksRaw = await Promise.all(
    friendsBooksData.map(async (item: any) => {
      const book = await fetchBookById(item.bookId);
      if (!book) return null;

      return {
        book,
        customCoverUrl: item.coverUrl,
        friendInfo: {
          username: item.username,
          fullName: item.fullName,
          avatarUrl: item.avatarUrl,
          rating: item.rating || 0,
        },
      };
    })
  );

  const validFriendsBooks = friendsBooksRaw
    .filter(Boolean)
    .slice(0, 8);

  return (
    <main className="min-h-screen text-white mx-auto">
      {!currentUser && <HomeHeader currentUser={currentUser} />}

      <div className="flex flex-col gap-8 mt-8">



        {validFriendsBooks.length > 0 && (
          <section className="mb-10 w-min">
            <div className="flex items-center justify-between mb-4 px-4 lg:px-0">
              <h2 className="text-xl font-semibold text-white">
                New from Friends
              </h2>
              <Link
                href="/friends/books"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                See all →
              </Link>
            </div>

            <div className="relative">
              <div className="flex gap-4 py-2 px-4 lg:px-0 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-thin scroll-hidden">
                {validFriendsBooks.map((item: any) => (
                  <div
                    key={item.book.id}
                    className="flex-shrink-0 w-36 snap-start"
                  >
                    <BookCard
                      book={item.book}
                      roundedBottom={false}
                      friendInfo={item.friendInfo}
                      customCoverUrl={item.customCoverUrl}
                      rating={
                        item.friendInfo.rating > 0
                          ? { value: item.friendInfo.rating }
                          : undefined
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#141414]/80 to-transparent pointer-events-none" />
              <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#141414]/80 to-transparent pointer-events-none" />
            </div>
          </section>
        )}


        {categories.map((category, index) => {
          const books = categoryResults[index];
          if (!books || books.length === 0) return null;

          return (
            <BookCategoryRow
              key={category.title}
              title={category.title}
              books={books}
            />
          );
        })}
      </div>
    </main>
  );
}
