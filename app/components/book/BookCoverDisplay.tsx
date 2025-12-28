"use client";

import Image from "next/image";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

type BookCoverDisplayProps = {
    defaultThumbnail: string;
    customCoverUrl?: string;
    title: string;
    resetOnClick?: boolean;
};

export default function BookCoverDisplay({
    defaultThumbnail,
    customCoverUrl,
    title,
    resetOnClick,
}: BookCoverDisplayProps) {
    const [showOriginal, setShowOriginal] = useState(false);
    const hasCustomCover = !!customCoverUrl;

    const displayUrl = showOriginal || !customCoverUrl ? defaultThumbnail : customCoverUrl;

    return (
        <div className="relative w-[250px] lg:w-full aspect-[2/3] rounded-lg shadow-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group">
            <Image
                src={displayUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 250px, 300px"
                priority
            />

            {hasCustomCover && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setShowOriginal(!showOriginal);
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm"
                    title={showOriginal ? "Özel kapağı göster" : "Orjinal kapağı göster"}
                >
                    <RefreshCw size={16} />
                </button>
            )}
        </div>
    );
}
