"use client";

import { Book } from "../../../types/book";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ReviewCard from "../../../components/review/ReviewCard";

// 1. Hata Çözümü: fetchBookById fonksiyonunu sayfa içine ekledik
async function fetchBookById(id: string): Promise<Book | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// 2. Hata Çözümü: Tip tanımlamalarını buraya ekledik
type ReviewData = {
  bookId: string;
  rating: number;
  review: string;
  liked?: boolean;
  isFirstTime?: boolean;
};

type ProfileData = {
  id: number;
  username: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bio?: string | null;
};

type ReviewWithBook = ReviewData & {
  book: Book | null;
};

export default function ProfileReviewsPage() {
  const params = useParams();
  const profileId = params?.id?.toString() || "profil";
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewWithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/p/${encodeURIComponent(profileId)}/reviews`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          console.error("Kullanıcı incelemeleri yüklenemedi");
          setLoading(false);
          return;
        }

        const data = await res.json();
        const reviewData: ReviewData[] = data.reviews || [];
        const profileData = data.profile;

        setProfile(profileData);

        const reviewsWithBooks = await Promise.all(
          reviewData.map(async (review) => {
            const book = await fetchBookById(review.bookId);
            return { ...review, book };
          })
        );

        setReviews(reviewsWithBooks.filter((r) => r.book !== null));
      } catch (error) {
        console.error("İncelemeler yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [profileId]);

  // page.tsx içindeki return kısmı
  return (
    <div className="min-h-screen text-white w-full">
      {/* Sola yaslı ve genişliği artırılmış ana konteyner */}
      <div className="w-full max-w-[1400px] px-6 py-10"> 
        <div className="w-full flex flex-col items-start space-y-8">
          {loading ? (
            <p className="text-gray-500 text-lg animate-pulse">İncelemeler yükleniyor…</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 text-lg">Henüz inceleme yok.</p>
          ) : (
            <div className="w-full flex flex-col items-start space-y-8">
              {reviews.map((review) => (
                <div key={review.bookId} className="w-full">
                  <ReviewCard
                    review={review}
                    book={review.book}
                    profile={profile!}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}