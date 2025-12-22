import Link from "next/link";
import BookListItem from "../components/book/BookListItem";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  genre?: string;
  sort?: string;
  page?: string;
};

const GENRES = [
  "fiction",
  "history",
  "fantasy",
  "romance",
  "science",
  "biography",
  "mystery",
  "thriller",
  "poetry",
];

const SORT_OPTIONS: { value: string; label: string; orderBy?: string }[] = [
  { value: "popular", label: "Popüler" },
  { value: "newest", label: "En yeni", orderBy: "newest" },
];

type GoogleBooksResponse = {
  totalItems: number;
  items?: any[];
};

async function fetchBooks({
  query,
  startIndex,
  sort,
}: {
  query: string;
  startIndex: number;
  sort: string;
}): Promise<GoogleBooksResponse> {
  const sortOption = SORT_OPTIONS.find((s) => s.value === sort);
  const params = new URLSearchParams({
    q: query || "books",
    maxResults: "20",
    startIndex: String(startIndex),
  });

  if (sortOption?.orderBy) {
    params.set("orderBy", sortOption.orderBy);
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return { totalItems: 0, items: [] };
    }

    const data = (await res.json()) as GoogleBooksResponse;
    return {
      totalItems: data.totalItems || 0,
      items: data.items || [],
    };
  } catch {
    return { totalItems: 0, items: [] };
  }
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const genre = params.genre || "";
  const sort = params.sort || "popular";
  const page = Number(params.page || "1");
  const currentPage = Number.isNaN(page) || page < 1 ? 1 : page;

  const queryTerm = q || genre || "bestseller";
  const startIndex = (currentPage - 1) * 20;

  const { items: books, totalItems } = await fetchBooks({
    query: queryTerm,
    startIndex,
    sort,
  });

  const hasPrev = currentPage > 1;
  const hasNext = startIndex + (books?.length || 0) < (totalItems || 0);

  const buildHref = (overrides: Partial<SearchParams>) => {
    const sp = new URLSearchParams();
    const merged: SearchParams = {
      q,
      genre,
      sort,
      page: String(currentPage),
      ...overrides,
    };

    if (merged.q) sp.set("q", merged.q);
    if (merged.genre) sp.set("genre", merged.genre);
    if (merged.sort && merged.sort !== "popular") sp.set("sort", merged.sort);
    if (merged.page && merged.page !== "1") sp.set("page", merged.page);

    const qs = sp.toString();
    return qs ? `/books?${qs}` : "/books";
  };

  return (
    <main className="min-h-screen text-white w-full">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Başlık / açıklama */}
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            Kitapları keşfet
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl">
            Unperline evreninde bulunan kitapları keşfet. Kitapları takip et, okumak istediklerini kaydet ve arkadaşlarına neyin iyi olduğunu söyle.
          </p>
        </header>

        {/* Üst arama ve sıralama barı */}
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Arama formu */}
          <form
            action="/books"
            className="w-full md:max-w-md flex items-center gap-2"
          >
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Kitap, yazar veya isim ara…"
              className="flex-1 rounded-md bg-neutral-900 border border-white/10 px-3 py-2 text-sm md:text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            {genre && (
              <input type="hidden" name="genre" value={genre} />
            )}
            {sort && (
              <input type="hidden" name="sort" value={sort} />
            )}
            
          </form>

          {/* Sıralama seçenekleri */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Sırala:</span>
            <div className="inline-flex rounded-md bg-neutral-900 border border-white/10 p-1">
              {SORT_OPTIONS.map((option) => {
                const active = sort === option.value || (!sort && option.value === "popular");
                return (
                  <Link
                    key={option.value}
                    href={buildHref({ sort: option.value, page: "1" })}
                    className={`px-3 py-1 rounded-md text-xs md:text-sm transition-colors ${
                      active
                        ? "bg-white text-black"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tür filtresi */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Tür
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildHref({ genre: "", page: "1" })}
              className={`px-3 py-1.5 rounded-full text-xs md:text-sm border transition-colors ${
                !genre
                  ? "bg-white text-black border-white"
                  : "border-white/10 text-gray-300 hover:border-white/40"
              }`}
            >
              Hepsi
            </Link>
            {GENRES.map((g) => {
              const isActive = genre === g;
              return (
                <Link
                  key={g}
                  href={buildHref({ genre: g, page: "1" })}
                  className={`px-3 py-1.5 rounded-full text-xs md:text-sm border transition-colors capitalize ${
                    isActive
                      ? "bg-white text-black border-white"
                      : "border-white/10 text-gray-300 hover:border-white/40"
                  }`}
                >
                  {g}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Liste */}
        <section className="space-y-4">
          {(!books || books.length === 0) && (
            <p className="text-gray-500 text-sm md:text-base">
              Bu kriterlere uyan kitap bulunamadı. Farklı bir arama deneyin
              veya tür filtresini temizleyin.
            </p>
          )}

          {books && books.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs md:text-sm text-gray-400">
                Toplam yaklaşık {totalItems.toLocaleString("tr-TR")} sonuçtan{" "}
                {startIndex + 1}–{startIndex + books.length} arası
              </p>
              <div className="flex flex-col divide-y divide-white/5">
                {books.map((book) => (
                  <div key={book.id} className="py-3">
                    <BookListItem book={book} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Sayfalama */}
        {books && books.length > 0 && (
          <section className="flex items-center justify-between pt-4 border-t border-white/10 text-sm">
            <div className="text-gray-400">
              Sayfa {currentPage}
              {totalItems > 0 && (
                <span className="text-gray-500">
                  {" "}
                  · Toplam {Math.ceil(totalItems / 20)} sayfa
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                href={
                  hasPrev
                    ? buildHref({ page: String(currentPage - 1) })
                    : "#"
                }
                aria-disabled={!hasPrev}
                className={`px-3 py-1.5 rounded-md border text-xs md:text-sm transition-colors ${
                  hasPrev
                    ? "border-white/20 text-white hover:bg-white hover:text-black"
                    : "border-white/10 text-gray-500 cursor-not-allowed"
                }`}
              >
                Önceki
              </Link>
              <Link
                href={
                  hasNext
                    ? buildHref({ page: String(currentPage + 1) })
                    : "#"
                }
                aria-disabled={!hasNext}
                className={`px-3 py-1.5 rounded-md border text-xs md:text-sm transition-colors ${
                  hasNext
                    ? "border-white/20 text-white hover:bg-white hover:text-black"
                    : "border-white/10 text-gray-500 cursor-not-allowed"
                }`}
              >
                Sonraki
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}


