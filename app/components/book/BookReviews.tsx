"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import StarDisplay from "../ui/StarDisplay";

type Review = {
    userId: number;
    username: string;
    fullName: string | null;
    avatarUrl: string | null;
    rating: number;
    review: string;
    ratedAt?: string;
};

export default function BookReviews({ bookId }: { bookId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const res = await fetch(`/api/books/${bookId}/reviews`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data.reviews || []);
                }
            } catch (error) {
                console.error("Yorumlar yüklenirken hata:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchReviews();
    }, [bookId]);

    if (loading) return <div className="text-gray-500 mt-8">Yorumlar yükleniyor...</div>;

    if (reviews.length === 0) {
        return (
            <div className="mt-12 pt-8 border-t border-white/10">
                <h2 className="text-2xl font-bold mb-4">Değerlendirmeler</h2>
                <p className="text-gray-400">Henüz yorum yapılmamış.</p>
            </div>
        );
    }

    return (
        <div className="mt-12 pt-8 border-t border-white/10 w-full">
            <h2 className="text-2xl font-bold mb-6">Değerlendirmeler ({reviews.length})</h2>
            <div className="grid gap-6">
                {reviews.map((review, index) => (
                    <div key={`${review.userId}-${index}`} className="bg-neutral-900/40 p-6 rounded-lg border border-white/5">
                        <div className="flex items-start gap-4">
                            <Link href={`/p/${review.username}`} className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                                    <Image
                                        src={review.avatarUrl || "/user.png"}
                                        alt={review.username}
                                        width={48}
                                        height={48}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </Link>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                                    <Link href={`/p/${review.username}`} className="font-semibold text-lg hover:underline truncate">
                                        {review.fullName || review.username}
                                    </Link>
                                    <span className="text-xs text-gray-500">
                                        {review.ratedAt ? new Date(review.ratedAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <StarDisplay rating={review.rating} starSize="w-4 h-4" />
                                </div>

                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                                    {review.review}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
