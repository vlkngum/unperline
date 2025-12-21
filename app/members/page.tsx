
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

// Icons
function ChevronDownIcon({ className }: { className?: string }) {
    return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
}

function EyeIcon({ className }: { className?: string }) { return (<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>); }
function GridIcon({ className }: { className?: string }) { return (<svg fill="currentColor" viewBox="0 0 24 24" className={className}><path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" /></svg>); }
function UserIcon({ className }: { className?: string }) { return (<svg fill="currentColor" viewBox="0 0 24 24" className={className}><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>); }

export const dynamic = "force-dynamic";

export default async function MembersPage() {

    // Fetch users from database, sorted alphabetically
    const users = await prisma.user.findMany({
        orderBy: {
            username: "asc"
        },
        select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
            readBooks: true,
            // In a real app we would join followers/following tables
        }
    });

    return (
        <main className="min-h-screen text-slate-200 selection:bg-indigo-500/30 w-full py-10">

            {/* Arkaplan Efekti */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

            <div className="relative z-10 w-full max-w-7xl mx-auto bg-[#0B0E14]/80 min-h-screen py-12 px-4 md:px-8 pb-20 space-y-16">


                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 border-b border-slate-800 pb-4 gap-4 ">

                    {/* Başlık */}
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Üyeler</h1>
                        <p className="text-slate-500 text-sm mt-1">Okurları keşfet, takip et ve etkileşime geç.</p>
                    </div>

                    {/* Sort Info (Static since always A-Z) */}
                    <div className="relative z-50">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">A-Z Sıralı</span>
                    </div>
                </div>

                {/* --- MEMBER LIST TABLE --- */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">

                    {/* Table Header */}
                    <div className="hidden sm:flex bg-slate-950/50 px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                        <div className="flex-1">Üye</div>
                        <div className="w-auto flex gap-8 pr-2">
                            <span className="w-16 text-right">Kitap</span>
                            <span className="w-16 text-right">Takipçi</span>
                            <span className="w-16 text-right">Takip Edilen</span>
                        </div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-slate-800/50">
                        {users.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                Henüz hiç üye yok.
                            </div>
                        ) : (
                            users.map((member) => (
                                <div
                                    key={member.id}
                                    className="group flex flex-col sm:flex-row items-center justify-between py-3 px-4 sm:px-6 hover:bg-indigo-900/10 transition-colors duration-200 cursor-pointer"
                                >
                                    {/* Sol: Avatar ve İsim */}
                                    <Link href={`/p/${member.username}`} className="flex items-center gap-4 w-full sm:w-auto mb-2 sm:mb-0">
                                        <div className="relative w-10 h-10 flex-shrink-0">
                                            <Image
                                                src={member.avatarUrl || "/user.png"}
                                                alt={member.username}
                                                fill
                                                className="rounded-full object-cover border border-slate-700 group-hover:border-indigo-500 transition-colors"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="text-slate-200 font-semibold text-sm group-hover:text-white transition-colors">
                                                {member.fullName || member.username}
                                            </h4>
                                            <span className="text-slate-500 text-xs group-hover:text-slate-400">
                                                @{member.username}
                                            </span>
                                        </div>
                                    </Link>

                                    {/* Sağ: İstatistikler */}
                                    <div className="flex items-center gap-6 sm:gap-8 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0 px-2 sm:px-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-2 w-16 justify-end group/icon" title="Okunan Kitaplar">
                                            <EyeIcon className="w-4 h-4 text-emerald-500 group-hover/icon:scale-110 transition-transform" />
                                            <span className="text-sm font-medium text-slate-300 tabular-nums">
                                                {member.readBooks.length}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 w-16 justify-end group/icon" title="Takipçi">
                                            <UserIcon className="w-4 h-4 text-indigo-400 group-hover/icon:scale-110 transition-transform" />
                                            <span className="text-sm font-medium text-slate-300 tabular-nums">
                                                0
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 w-16 justify-end group/icon" title="Takip Edilen">
                                            <UserIcon className="w-4 h-4 text-orange-500 group-hover/icon:scale-110 transition-transform" />
                                            <span className="text-sm font-medium text-slate-300 tabular-nums">
                                                0
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )))}
                    </div>
                </div>

                {/* --- PAGINATION (Simplified for now) --- */}
                <div className="mt-8 flex justify-center items-center gap-2 text-slate-500 text-sm">
                    Toplam {users.length} üye listelendi.
                </div>

            </div>
        </main>
    );
}