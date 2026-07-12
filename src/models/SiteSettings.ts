import mongoose, { Schema, models } from "mongoose";

export interface ISiteSettings {
  aboutHighlight: string;
  aboutDescription: string;
  countdownDate: string;
  countdownLabel: string;
  announcementTitle: string;
  announcementDeadline: string;
  announcementNote: string;
  registrationOpen: boolean;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventAudience: string;
  whatsapp: string;
  whatsappLabel: string;
  whatsappLink: string;
  locationName: string;
  locationAddress: string;
  footerCopyright: string;
  footerCredit: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    aboutHighlight: { type: String, default: "Kegiatan 17 Agustus 2026 RT 011" },
    aboutDescription: {
      type: String,
      default:
        "merupakan wujud rasa syukur atas kemerdekaan Indonesia. Mari kita pererat persaudaraan, junjung sportivitas, dan ciptakan momen berharga bersama.",
    },
    countdownDate: { type: String, default: "2026-08-17" },
    countdownLabel: { type: String, default: "MENUJU 17 AGUSTUS 2026" },
    announcementTitle: { type: String, default: "PENDAFTARAN DITUTUP" },
    announcementDeadline: { type: String, default: "16 AGUSTUS 2026 PUKUL 21.00 WIB" },
    announcementNote: {
      type: String,
      default: "Segera daftarkan diri Anda untuk mengikuti berbagai lomba menarik!",
    },
    registrationOpen: { type: Boolean, default: true },
    eventDate: { type: String, default: "17 AGUSTUS 2026" },
    eventTime: { type: String, default: "08.00 - SELESAI" },
    eventLocation: { type: String, default: "LINGKUNGAN RT 011" },
    eventAudience: { type: String, default: "BALITA HINGGA DEWASA" },
    whatsapp: { type: String, default: "0895-1787-2311" },
    whatsappLabel: { type: String, default: "Pengelola Web Lomba 17 Agustus" },
    whatsappLink: { type: String, default: "6289517872311" },
    locationName: { type: String, default: "Lingkungan RT 011" },
    locationAddress: { type: String, default: "Jl Walang Sari Raya" },
    footerCopyright: { type: String, default: "© 2026 Crew RT 011. Dirgahayu Republik Indonesia." },
    footerCredit: { type: String, default: "Dibuat Oleh Shandy" },
  },
  { timestamps: true }
);

export const SiteSettings =
  models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
