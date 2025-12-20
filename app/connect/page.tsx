"use client";

import Image from "next/image";
import Link from "next/link"; 

const mockUsers = [
  {
    id: 1,
    name: "Derrick",
    username: "simiviews",
    avatar: "https://i.pravatar.cc/150?u=derrick",
    stats: { films: "1.8K", reviews: "923" },
    favorites: [
      "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      "https://image.tmdb.org/t/p/w500/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg",
      "https://image.tmdb.org/t/p/w500/enRimDhtFfb7hNTQlOjrgK8O8UO.jpg",
    ],
    isFeatured: true,
  },
  {
    id: 2,
    name: "Emma",
    username: "emma_reads",
    avatar: "https://i.pravatar.cc/150?u=emma",
    stats: { films: "683", reviews: "284" },
    favorites: [
      "https://image.tmdb.org/t/p/w500/enRimDhtFfb7hNTQlOjrgK8O8UO.jpg",
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      "https://image.tmdb.org/t/p/w500/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg",
      "https://image.tmdb.org/t/p/w500/enRimDhtFfb7hNTQlOjrgK8O8UO.jpg",
    ],
    isFeatured: true,
  },
  {
    id: 3,
    name: "Daniel's Thoughts",
    username: "danthots",
    avatar: "https://i.pravatar.cc/150?u=daniel",
    stats: { films: "2.4K", reviews: "1.1K" },
    favorites: [
      "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      "https://image.tmdb.org/t/p/w500/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg",
      "https://image.tmdb.org/t/p/w500/enRimDhtFfb7hNTQlOjrgK8O8UO.jpg",
    ],
    isFeatured: true,
  },
  {
    id: 4,
    name: "Jane Badall",
    username: "jane_b",
    avatar: "https://i.pravatar.cc/150?u=jane",
    stats: { films: "367", reviews: "168" },
    favorites: [
      "https://image.tmdb.org/t/p/w500/enRimDhtFfb7hNTQlOjrgK8O8UO.jpg",
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      "https://image.tmdb.org/t/p/w500/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg",
      "https://image.tmdb.org/t/p/w500/enRimDhtFfb7hNTQlOjrgK8O8UO.jpg",
    ],
    isFeatured: true,
  },
  {
    id: 5,
    name: "Christian G.",
    username: "chris_guti",
    avatar: "https://i.pravatar.cc/150?u=christian",
    stats: { films: "1.9K", reviews: "1.6K" },
    favorites: [
      "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    ],
    isFeatured: true,
  },
  { id: 6, name: "Jay", username: "jay_walking", avatar: "https://i.pravatar.cc/150?u=jay", stats: { films: "1,704", lists: "80", likes: "1,025" }, isFeatured: false },
  { id: 7, name: "BenOfTheWeek", username: "benweek", avatar: "https://i.pravatar.cc/150?u=ben", stats: { films: "702", lists: "1", likes: "209" }, isFeatured: false },
  { id: 8, name: "Mak", username: "_mak_", avatar: "https://i.pravatar.cc/150?u=mak", stats: { films: "618", lists: "39", likes: "53" }, isFeatured: false },
  { id: 9, name: "Demi Adejuyigbe", username: "electric_demi", avatar: "https://i.pravatar.cc/150?u=demi", stats: { films: "2,019", lists: "17", likes: "842" }, isFeatured: false },
  { id: 10, name: "Kenny", username: "kenny_logs", avatar: "https://i.pravatar.cc/150?u=kenny", stats: { films: "1,012", lists: "15", likes: "541" }, isFeatured: false },
  { id: 11, name: "Lucy", username: "lucy_sky", avatar: "https://i.pravatar.cc/150?u=lucy", stats: { films: "2,780", lists: "135", likes: "613" }, isFeatured: false },
  { id: 12, name: "David Sims", username: "d_sims", avatar: "https://i.pravatar.cc/150?u=david", stats: { films: "4,989", lists: "129", likes: "271" }, isFeatured: false },
];

export default function ConnectPlusPage() {
  const featuredMembers = mockUsers.filter((u) => u.isFeatured).slice(0, 5);
  const allMembers = mockUsers.slice(5);

  return (
    <main className="min-h-screen text-slate-200 selection:bg-indigo-500/30">
      
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto bg-[#0B0E14] min-h-screen py-12 px-4 md:px-8 mb-20 space-y-16">
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
            Connect<span className="text-indigo-500">+</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Topluluğumuzun öne çıkan üyelerini keşfet, kütüphaneni genişlet.
          </p>
        </div>

        <section className="relative">
          <div className="flex items-center gap-4 mb-8">
             <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
             <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-[0.2em] px-2 shadow-indigo-500/50 drop-shadow-sm">
                Öne Çıkan Üyeler
             </h2>
             <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm shadow-xl">
            {featuredMembers.map((member) => (
              <div key={member.id} className="flex flex-col items-center relative p-2 rounded-xl transition-all duration-300 hover:bg-white/5">
                
                <Link href="#" className="flex flex-col items-center group mb-4 w-full">
                    <div className="relative w-24 h-24 mb-3">
                      <div className="absolute inset-0 bg-indigo-500 blur-md opacity-0 group-hover:opacity-40 transition-opacity rounded-full duration-500" />
                        <Image
                            src={member.avatar}
                            alt={member.name}
                            fill
                            className="rounded-full object-cover border-[3px] border-slate-800 group-hover:border-indigo-500 transition-colors shadow-2xl relative z-10"
                      />
                    </div>
                    
                    {/* İsim & Username */}
                    <div className="text-center z-10">
                        <h3 className="text-white font-bold text-lg leading-tight group-hover:text-indigo-300 transition-colors">
                            {member.name}
                        </h3>
                        <div className="text-xs font-medium text-slate-500 mt-1">@{member.username}</div>
                    </div>
                </Link>

                <div className="flex items-center gap-2 mb-5 z-10">
                    <div className="text-[10px] uppercase tracking-wider text-indigo-300 font-semibold bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-500/20 shadow-sm">
                        {member.stats.films} Kitap
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50 shadow-sm">
                        {member.stats.reviews} İnceleme
                    </div>
                </div>

                <div className="flex gap-1.5 justify-center w-full px-2">
                  {member.favorites?.map((cover, idx) => (
                    <Link 
                        key={idx} 
                        href="#" 
                        className="relative w-10 aspect-[2/3] group/book"
                    >
                        <div className="relative w-full h-full rounded-sm overflow-hidden shadow-lg border border-white/10 group-hover/book:border-indigo-500/50 transition-all duration-300 group-hover/book:-translate-y-1 group-hover/book:shadow-indigo-500/20">
                            <Image src={cover} alt="fav" fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-50 group-hover/book:opacity-0 transition-opacity" />
                        </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
           <div className="flex justify-between items-end mb-4 border-b border-slate-800 pb-2 mx-2">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                Tüm Üyeler
            </h2>
            <span className="text-xs text-slate-500 font-medium">Son 30 günde aktif</span>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="hidden sm:flex bg-slate-950/50 px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                <div className="flex-1">Üye</div>
                <div className="w-auto flex gap-8 pr-2">
                    <span className="w-16 text-right">Okunan</span>
                    <span className="w-16 text-right">Liste</span>
                    <span className="w-16 text-right">Beğeni</span>
                </div>
            </div>

            <div className="divide-y divide-slate-800/50">
                {allMembers.map((member) => (
                <div 
                    key={member.id} 
                    className="group flex flex-col sm:flex-row items-center justify-between py-3 px-4 sm:px-6 hover:bg-indigo-900/10 transition-colors duration-200 cursor-pointer"
                >
                    <div className="flex items-center gap-4 w-full sm:w-auto mb-2 sm:mb-0">
                    <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                            src={member.avatar}
                            alt={member.name}
                            fill
                            className="rounded-full object-cover border border-slate-700 group-hover:border-indigo-500 transition-colors"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-slate-200 font-semibold text-sm group-hover:text-white transition-colors">
                            {member.name}
                        </h4>
                        <span className="text-slate-500 text-xs group-hover:text-slate-400">
                             @{member.username}
                        </span>
                    </div>
                    </div>

                    <div className="flex items-center gap-6 sm:gap-8 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0 px-2 sm:px-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 w-16 justify-end" title="Okudukları">
                            <EyeIcon className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-medium text-slate-300 tabular-nums">
                                {member.stats.films}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 w-16 justify-end" title="Listeleri">
                            <GridIcon className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-medium text-slate-300 tabular-nums">
                                {member.stats.lists}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 w-16 justify-end" title="Beğenileri">
                            <HeartIcon className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-medium text-slate-300 tabular-nums">
                                {member.stats.likes}
                            </span>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            
            <Link href="/members" className="block py-4 text-center bg-slate-900/30 hover:bg-slate-800/50 transition-colors border-t border-slate-800 cursor-pointer group">
                <span className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 uppercase tracking-widest">
                    Daha Fazla Göster
                </span>
            </Link>
          </div>
        </section>
        
        
      </div>
    </main>
  );
}

function EyeIcon({ className }: { className?: string }) { return (<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>); }
function GridIcon({ className }: { className?: string }) { return (<svg fill="currentColor" viewBox="0 0 24 24" className={className}><path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" /></svg>); }
function HeartIcon({ className }: { className?: string }) { return (<svg fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>); }