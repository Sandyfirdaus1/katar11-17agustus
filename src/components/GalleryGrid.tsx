"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  variant?: "preview" | "full";
  priorityCount?: number;
}

export default function GalleryGrid({
  images,
  variant = "full",
  priorityCount = 4,
}: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeImage = activeIndex !== null ? images[activeIndex] : null;
  const gridClass =
    variant === "preview"
      ? "grid grid-cols-2 gap-4 md:grid-cols-4"
      : "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4";

  useEffect(() => {
    if (activeIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowLeft") {
        setActiveIndex((index) => (index !== null && index > 0 ? index - 1 : index));
      }
      if (e.key === "ArrowRight") {
        setActiveIndex((index) =>
          index !== null && index < images.length - 1 ? index + 1 : index
        );
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, images.length]);

  return (
    <>
      <div className={gridClass}>
        {images.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-xl bg-gray-100 shadow-md transition-transform hover:scale-[1.02]"
            aria-label={`Perbesar ${item.alt}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={
                variant === "preview"
                  ? "(max-width: 768px) 50vw, 25vw"
                  : "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              }
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={index < priorityCount}
            />
          </button>
        ))}
      </div>

      {activeImage && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau gambar galeri"
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Tutup"
          >
            <X size={24} />
          </button>

          {activeIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(activeIndex - 1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Gambar sebelumnya"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <div
            className="relative h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          {activeIndex < images.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(activeIndex + 1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 md:right-16"
              aria-label="Gambar berikutnya"
            >
              <ChevronRight size={28} />
            </button>
          )}

          <p className="absolute bottom-4 left-1/2 max-w-lg -translate-x-1/2 truncate px-4 text-center text-sm text-white/80">
            {activeImage.alt}
          </p>
        </div>
      )}
    </>
  );
}
