"use client";

import { useState, useEffect } from "react";
import { X, Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CoverModalProps {
    bookId: string;
    isOpen: boolean;
    onClose: () => void;
    currentCoverUrl: string;
}

export default function CoverModal({
    bookId,
    isOpen,
    onClose,
    currentCoverUrl,
}: CoverModalProps) {
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState("");
    const [previewUrl, setPreviewUrl] = useState(currentCoverUrl);
    const [loading, setLoading] = useState(false);
    const [fileError, setFileError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setPreviewUrl(currentCoverUrl);
            setImageUrl("");
            setFileError("");
        }
    }, [isOpen, currentCoverUrl]);

    if (!isOpen) return null;

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setImageUrl(url);
        if (url) setPreviewUrl(url);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileError("");

        if (file) {
            if (file.size > 500 * 1024) { // 500KB limit
                setFileError("Dosya boyutu çok büyük (Max 500KB)");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImageUrl(result); // Base64 string
                setPreviewUrl(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/books/${bookId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "cover",
                    coverUrl: imageUrl,
                }),
            });

            if (res.ok) {
                router.refresh();
                onClose();
            }
        } catch (err) {
            console.error("Cover save error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200">

                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
                    <h2 className="text-lg font-semibold text-slate-200">
                        Kapak Resmi Değiştir
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6">
                    <div className="flex justify-center">
                        <div className="relative w-32 h-48 rounded-lg overflow-hidden shadow-lg border border-slate-700 bg-slate-800">
                            {previewUrl ? (
                                <Image
                                    src={previewUrl}
                                    alt="Book Cover Preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-500">
                                    <ImageIcon className="w-8 h-8 opacity-50" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Dosya Seç
                            </label>
                            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-lg p-8 transition-colors text-center cursor-pointer group relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-indigo-400 transition-colors">
                                    <Upload className="w-8 h-8" />
                                    <span className="text-sm font-medium">
                                        Resim yüklemek için tıkla
                                    </span>
                                    <span className="text-xs text-slate-600">
                                        PNG, JPG, GIF
                                    </span>
                                </div>
                            </div>
                            {fileError && (
                                <p className="text-red-400 text-xs mt-1">{fileError}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading || !!fileError}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/50 text-white font-bold py-2 px-6 rounded shadow-lg shadow-indigo-900/20 transition-all transform active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                        {loading ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                </div>
            </div>
        </div>
    );
}
