"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const mockMembers = [
  { id: 1, name: "Jay", username: "jay_walking", avatar: "https://i.pravatar.cc/150?u=jay", stats: { films: "1,704", lists: "80", likes: "1,025" } },
  { id: 2, name: "BenOfTheWeek", username: "benweek", avatar: "https://i.pravatar.cc/150?u=ben", stats: { films: "702", lists: "1", likes: "209" } },
  { id: 3, name: "Mak", username: "_mak_", avatar: "https://i.pravatar.cc/150?u=mak", stats: { films: "618", lists: "39", likes: "53" } },
  { id: 4, name: "Demi Adejuyigbe", username: "electric_demi", avatar: "https://i.pravatar.cc/150?u=demi", stats: { films: "2,019", lists: "17", likes: "842" } },
  { id: 5, name: "Kenny", username: "kenny_logs", avatar: "https://i.pravatar.cc/150?u=kenny", stats: { films: "1,012", lists: "15", likes: "541" } },
  { id: 6, name: "Lucy", username: "lucy_sky", avatar: "https://i.pravatar.cc/150?u=lucy", stats: { films: "2,780", lists: "135", likes: "613" } },
  { id: 7, name: "David Sims", username: "d_sims", avatar: "https://i.pravatar.cc/150?u=david", stats: { films: "4,989", lists: "129", likes: "271" } },
  { id: 8, name: "Karsten", username: "karsten_run", avatar: "https://i.pravatar.cc/150?u=karsten", stats: { films: "3,102", lists: "44", likes: "920" } },
  { id: 9, name: "Iana", username: "iana_reads", avatar: "https://i.pravatar.cc/150?u=iana", stats: { films: "540", lists: "12", likes: "115" } },
  { id: 10, name: "Brat Pitt", username: "not_brad", avatar: "https://i.pravatar.cc/150?u=brad", stats: { films: "1,200", lists: "5", likes: "330" } },
  { id: 11, name: "Silent Bob", username: "silent_b", avatar: "https://i.pravatar.cc/150?u=bob", stats: { films: "890", lists: "23", likes: "410" } },
  { id: 12, name: "Mia Wallace", username: "fox_force", avatar: "https://i.pravatar.cc/150?u=mia", stats: { films: "420", lists: "2", likes: "1,900" } },
];

export default function MembersPage() {
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Popülerlik (Bu Hafta)");

  const sortOptions = [
    "Popülerlik (Bu Hafta)",
    "Popülerlik (Tüm Zamanlar)",
    "En Çok İnceleme",
    "En Çok Kitap",
    "En Yeni Üyeler"
  ];

  return (
    <main className="min-h-screen text-slate-200 selection:bg-indigo-500/30 w-full py-10">
      
      {/* Arkaplan Efekti */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto bg-[#0B0E14]/80 min-h-screen py-12 px-4 md:px-8 pb-20 space-y-16">

        
        {/* --- HEADER & SORT BAR --- */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 border-b border-slate-800 pb-4 gap-4 ">
          
          {/* Başlık */}
          <div>
             <h1 className="text-3xl font-bold text-white tracking-tight">Üyeler</h1>
             <p className="text-slate-500 text-sm mt-1">Okurları keşfet, takip et ve etkileşime geç.</p>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative z-50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-3">Sırala</span>
            
            {/* DÜZELTME 2: Buton genişliği sabitlendi (w-[240px]) - Yazı değişince titreme yapmaz */}
            <button 
                onClick={() => setSortOpen(!sortOpen)}
                className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-indigo-500/50 text-slate-200 text-sm px-4 py-2 rounded-lg transition-all shadow-lg w-[240px] justify-between"
            >
                <span className="truncate">{selectedSort}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform flex-shrink-0 ${sortOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {sortOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                    
                    <div className="absolute right-0 top-full mt-2 w-[240px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        {sortOptions.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setSelectedSort(option);
                                    setSortOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                    selectedSort === option 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </>
            )}
          </div>
        </div>

        {/* --- MEMBER LIST TABLE --- */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
            
            {/* Table Header */}
            <div className="hidden sm:flex bg-slate-950/50 px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                <div className="flex-1">Üye</div>
                <div className="w-auto flex gap-8 pr-2">
                    <span className="w-16 text-right">Okunan</span>
                    <span className="w-16 text-right">Liste</span>
                    <span className="w-16 text-right">Beğeni</span>
                </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-800/50">
                {mockMembers.map((member) => (
                <div 
                    key={member.id} 
                    className="group flex flex-col sm:flex-row items-center justify-between py-3 px-4 sm:px-6 hover:bg-indigo-900/10 transition-colors duration-200 cursor-pointer"
                >
                    {/* Sol: Avatar ve İsim */}
                    <Link href="#" className="flex items-center gap-4 w-full sm:w-auto mb-2 sm:mb-0">
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
                    </Link>

                    {/* Sağ: İstatistikler */}
                    <div className="flex items-center gap-6 sm:gap-8 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0 px-2 sm:px-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 w-16 justify-end group/icon" title="Okudukları">
                            <EyeIcon className="w-4 h-4 text-emerald-500 group-hover/icon:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-slate-300 tabular-nums">
                                {member.stats.films}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 w-16 justify-end group/icon" title="Listeleri">
                            <GridIcon className="w-4 h-4 text-indigo-400 group-hover/icon:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-slate-300 tabular-nums">
                                {member.stats.lists}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 w-16 justify-end group/icon" title="Beğenileri">
                            <HeartIcon className="w-4 h-4 text-orange-500 group-hover/icon:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-slate-300 tabular-nums">
                                {member.stats.likes}
                            </span>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>

        {/* --- PAGINATION --- */}
        <div className="mt-8 flex justify-center items-center gap-2">
             <button className="px-3 py-1 text-sm text-slate-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                 &lt; Önceki
             </button>
             
             <button className="w-8 h-8 flex items-center justify-center rounded bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20">
                 1
             </button>
             <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white text-sm transition-colors">
                 2
             </button>
             <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white text-sm transition-colors">
                 3
             </button>
             <span className="text-slate-600 px-1">...</span>
             <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white text-sm transition-colors">
                 12
             </button>

             <button className="px-3 py-1 text-sm text-slate-300 hover:text-white transition-colors">
                 Sonraki &gt;
             </button>
        </div>

      </div>
    </main>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
    return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
}

function EyeIcon({ className }: { className?: string }) { return (<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>); }
function GridIcon({ className }: { className?: string }) { return (<svg fill="currentColor" viewBox="0 0 24 24" className={className}><path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" /></svg>); }
function HeartIcon({ className }: { className?: string }) { return (<svg fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>); }