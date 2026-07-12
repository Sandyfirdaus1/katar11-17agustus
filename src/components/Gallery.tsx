import Link from "next/link";
import { Images, ChevronRight } from "lucide-react";
import GalleryGrid from "./GalleryGrid";
import {
  getGalleryPreviewSections,
  groupGalleryByYear,
  type GalleryImageItem,
} from "@/lib/gallery-utils";

interface GalleryProps {
  images: GalleryImageItem[];
}

export default function Gallery({ images }: GalleryProps) {
  const previewSections = getGalleryPreviewSections(groupGalleryByYear(images), 4);
  const previewImages = previewSections.flatMap((section) =>
    section.images.map((image) => ({ ...image, year: section.year }))
  );

  return (
    <section className="bg-[#fafafa] py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-8 text-center text-2xl font-extrabold tracking-wide text-[#DC2626] md:text-3xl">
          GALERI KEGIATAN
        </h2>

        <div className="space-y-8">
          <GalleryGrid
            images={previewImages}
            variant="preview"
            priorityCount={2}
            groupByYear
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/galeri"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#DC2626] bg-white px-8 py-3 text-sm font-bold text-[#DC2626] transition-all hover:bg-[#DC2626] hover:text-white md:text-base"
          >
            <Images size={18} />
            LIHAT SEMUA GALERI
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
