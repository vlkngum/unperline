"use client";

import { Book } from "../../../types/book";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ReviewCard from "../../../components/review/ReviewCard";

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
          {
            cache: "no-store",
          }
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

        // Her review için kitap bilgilerini çek
        const reviewsWithBooks = await Promise.all(
          reviewData.map(async (review) => {
            const book = await fetchBookById(review.bookId);
            return {
              ...review,
              book,
            };
          })
        );

        // Kitap bilgisi olanları filtrele
        setReviews(reviewsWithBooks.filter((r) => r.book !== null));
      } catch (error) {
        console.error("İncelemeler yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [profileId]);

  return (
    <div className="min-h-screen text-white w-full">
      <div className="max-w-4xl mx-auto w-full">
        <div className="px-4 py-8 space-y-6 w-full">
          {loading ? (
            <p className="text-gray-500">İncelemeler yükleniyor…</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500">Henüz inceleme yok.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.bookId}
                  review={review}
                  book={review.book}
                  profile={profile!}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}