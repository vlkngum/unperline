import Image from "next/image";
import BookTabs from "./BookTabs";

async function getBook(id: string) {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
  return await res.json();
}

export default async function BookDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBook(id);
  const info = book?.volumeInfo || {};

  const thumbnail =
    info.imageLinks?.thumbnail?.replace("http:", "https:") || 
    "https://placehold.co/200x300/1f1f1f/404040?text=No+Cover";

  return (
    <main className="py-10 flex justify-center text-white w-full">
      <div className="w-full rounded-2xl  overflow-hidden flex flex-col md:flex-row gap-8 transition-transform hover:scale-[1.01]">
        <div className="flex-shrink-0">
          <Image
            src={thumbnail}
            alt={info.title || "Untitled"}
            width={400}
            height={600}
            className="rounded-lg shadow-lg object-cover"
          />
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
