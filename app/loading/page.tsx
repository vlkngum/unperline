
export default function Loading() {
  return (
    <main className="min-h-screen text-white py-6 mx-auto"> 
      
      <div className="h-16 bg-gray-800/50 rounded-lg animate-pulse mb-8" />
 
      <div className="flex flex-col gap-8 mt-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <section key={i} className="w-full"> 
            <div className="h-6 bg-gray-800/50 rounded w-48 mb-4 animate-pulse" />
             
            <div className="flex gap-4 py-2 overflow-hidden">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                <div key={j} className="flex-shrink-0 w-36">
                  <div className="bg-gray-800/50 rounded-lg h-52 animate-pulse" />
                  <div className="mt-2 space-y-2">
                    <div className="h-4 bg-gray-800/50 rounded animate-pulse" />
                    <div className="h-3 bg-gray-800/50 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}