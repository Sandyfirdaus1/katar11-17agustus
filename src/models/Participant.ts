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
  categories?: string[];
  category?: string;
  teamName?: string;
  teamMembers?: string[];
  lombaStatuses?: Map<string, ParticipantStatus>;
  status?: ParticipantStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1, max: 120 },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    // New fields for multiple categories
    categories: { type: [String], required: false },
    // Legacy field for backward compatibility
    category: { type: String },
    teamName: { type: String, trim: true },
    teamMembers: { type: [String], required: false },
    lombaStatuses: {
      type: Map,
      of: {
        type: String,
        enum: ["terdaftar", "lolos", "juara1", "juara2", "juara3", "didiskualifikasi"],
      },
      default: {},
    },
    // Legacy field for backward compatibility
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
