"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";

export type ProfileStats = {
  books: number;
  followers: number;
  following: number;
};

export const DEFAULT_PROFILE_STATS: ProfileStats = {
  books: 28,
  followers: 5,
  following: 32,
};

export type ProfileHeaderData = {
  profileId: string;
  profileName: string;
  isOwner: boolean;
  bannerUrl: string;
  profileImage: string;
  stats?: ProfileStats; 
  description?: string;
  editHref?: string;
  followButton?: React.ReactNode;
};

export type ProfileHeaderProps = {
  profile: ProfileHeaderData;
};

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const {
    profileId,
    profileName,
    isOwner,
    bannerUrl,
    profileImage,
    stats = DEFAULT_PROFILE_STATS,  
    description,
    editHref,
    followButton,
  } = profile;
  return (
    <header className="border-b border-white/10 w-full relative">
      <div className="relative w-full"> 
        <div className={`relative w-full overflow-hidden ${bannerUrl ? "h-64 md:h-[400px] ring-1 ring-white/5 shadow-2xl" : "h-24 md:h-[300px]"}`}>
          {bannerUrl && (
            <Image
              src={bannerUrl}
              alt="banner"
              fill
              className="object-cover"
              priority
            /> 
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
           
          <div className="absolute inset-0 flex flex-col justify-end pb-6 md:pb-8 px-4 md:px-6"> 
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8 relative z-10"> 
              <div className="flex-shrink-0 -mt-16 md:-mt-20">
                
              {profileImage && (
                <Image
                  src={profileImage}
                  alt="Avatar"
                  width={144}
                  height={144}
                  className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl bg-neutral-800 object-cover"
                />
              )}
              </div>
 
              <div className="flex-1 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 w-full">
                <div className="space-y-3 flex-1">
                  <h1 className="text-2xl md:text-3xl font-semibold text-white drop-shadow-lg">
                    {profileId}
                  </h1>
                </div>

                <div className="flex gap-6 md:gap-8 text-sm text-gray-200 md:ml-auto drop-shadow-md">
                  <span>
                    <b className="text-white">{stats.books}</b> Kitap
                  </span>
                  <span>
                    <b className="text-white">{stats.followers}</b> Takipçi
                  </span>
                  <span>
                    <b className="text-white">{stats.following}</b> Takip
                  </span>
                </div>
              </div>
            </div>
            
            {/* Description + Edit Button */}
            <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mt-4 md:mt-6 relative z-10">
              <div className="flex-1 space-y-2">
                {profileName && (
                    <h1 className="text-sm md:text-md font-semibold text-white drop-shadow-lg">
                      {profileName}
                    </h1>
                  )}

                {description && (
                  <p className="text-gray-200 text-sm md:text-base max-w-2xl leading-relaxed drop-shadow-md">
                    {description}
                  </p>
                )}
              </div> 
              {isOwner && editHref && (
                <Link
                  href={editHref}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-100 transition shadow-lg flex-shrink-0"
                >
                  <Pencil size={16} />
                  <span>Profili Düzenle</span>
                </Link>
              )}
              {followButton && (
                <div className="flex-shrink-0">
                  {followButton}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

