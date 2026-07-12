import mongoose, { Schema, models } from "mongoose";

export interface IAdmin {
  username: string;
  password: string;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const Admin = models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
