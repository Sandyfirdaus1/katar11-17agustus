import mongoose, { Schema, models } from "mongoose";

export type ParticipantStatus =
  | "terdaftar"
  | "lolos"
  | "juara1"
  | "juara2"
  | "juara3"
  | "didiskualifikasi";

export interface IParticipant {
  name: string;
  age: number;
  phone: string;
  address: string;
  category: string;
  status: ParticipantStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1, max: 120 },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["terdaftar", "lolos", "juara1", "juara2", "juara3", "didiskualifikasi"],
      default: "terdaftar",
    },
  },
  { timestamps: true }
);

export const Participant =
  models.Participant || mongoose.model<IParticipant>("Participant", ParticipantSchema);
