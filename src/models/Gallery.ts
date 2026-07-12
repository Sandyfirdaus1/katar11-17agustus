import mongoose, { Schema, models } from "mongoose";

export interface IGallery {
  src: string;
  alt: string;
  year: number;
  order: number;
}

const GallerySchema = new Schema<IGallery>(
  {
    src: { type: String, required: true },
    alt: { type: String, default: "Dokumentasi kegiatan 17 Agustus" },
    year: { type: Number, default: 2025 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Gallery =
  models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);
