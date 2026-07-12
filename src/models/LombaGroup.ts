import mongoose, { Schema, models } from "mongoose";

export interface ILombaGroup {
  group: string;
  age: string;
  lomba: string[];
  order: number;
}

const LombaGroupSchema = new Schema<ILombaGroup>(
  {
    group: { type: String, required: true },
    age: { type: String, required: true },
    lomba: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const LombaGroup =
  models.LombaGroup || mongoose.model<ILombaGroup>("LombaGroup", LombaGroupSchema);
