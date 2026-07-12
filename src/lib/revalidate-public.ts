import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateSiteSettings() {
  revalidateTag("site-settings", "max");
  revalidatePath("/");
  revalidatePath("/daftar");
}

export function revalidateLombaData() {
  revalidateTag("lomba-groups", "max");
  revalidatePath("/");
  revalidatePath("/daftar");
}

export function revalidateGalleryData() {
  revalidateTag("gallery-images", "max");
  revalidatePath("/");
  revalidatePath("/galeri");
}

export function revalidateParticipantData() {
  revalidateTag("participants", "max");
  revalidateTag("participant-stats", "max");
  revalidatePath("/");
  revalidatePath("/peserta");
}
