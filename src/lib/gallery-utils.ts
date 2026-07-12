export interface GalleryImageItem {
  src: string;
  alt: string;
  year?: number;
}

export interface GalleryYearSection {
  year: number;
  images: GalleryImageItem[];
}

const DEFAULT_GALLERY_YEAR = 2025;

export function normalizeGalleryYear(year?: number): number {
  return typeof year === "number" && year > 1900 ? year : DEFAULT_GALLERY_YEAR;
}

export function groupGalleryByYear(images: GalleryImageItem[]): GalleryYearSection[] {
  const grouped = new Map<number, GalleryImageItem[]>();

  for (const image of images) {
    const year = normalizeGalleryYear(image.year);
    const list = grouped.get(year) ?? [];
    list.push(image);
    grouped.set(year, list);
  }

  return Array.from(grouped.entries())
    .sort(([yearA], [yearB]) => yearB - yearA)
    .map(([year, sectionImages]) => ({ year, images: sectionImages }));
}

export function getGalleryPreviewSections(
  sections: GalleryYearSection[],
  maxImages = 4
): GalleryYearSection[] {
  let remaining = maxImages;

  return sections
    .map((section) => {
      const images = section.images.slice(0, remaining);
      remaining -= images.length;
      return { year: section.year, images };
    })
    .filter((section) => section.images.length > 0);
}
