import Image from "next/image";
import BookTabs from "./BookTabs";
import BookActions from "@/app/components/book/BookActions"; 

async function getBook(id: string) {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
  return await res.json();
}

export default async function BookDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBook(id);
  const info = book?.volumeInfo || {};
  const imageLinks = info.imageLinks || {};

  const rawImageUrl =
    imageLinks.extraLarge ||
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail ||
    imageLinks.smallThumbnail ||
    "";

  const thumbnail = rawImageUrl
    ? rawImageUrl.replace("http:", "https:")
    : "https://placehold.co/400x600/1f1f1f/404040?text=No+Cover";

  return (
    <main className="py-10 flex justify-center text-white w-full px-4 md:px-8">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        <div className="lg:col-span-3 flex flex-col items-center lg:items-start">
          <div className="relative w-[250px] lg:w-full aspect-[2/3] rounded-lg shadow-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300">
             <Image
              src={thumbnail}
              alt={info.title || "Untitled"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 250px, 300px"
              priority
            />
          </div>
        </div>

        <div className="flex w-full flex-col justify-between py-4 px-8">
          <div className="">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 hover:text-indigo-400 transition-colors cursor-pointer">
              {info.title || "No title"}
            </h1>
            <p className="text-indigo-300 pl-1 mb-5">{info.authors?.join(", ") || "Unknown author"}</p>
            
            <div className="w-full ">
                <BookTabs info={info} />
            </div>
        
          </div>

           
        </div>

      </div>
    </main>
  );
}