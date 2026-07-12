export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, "");
  if (!cleaned || cleaned.length < 8) return phone || "-";

  const visibleStart = 4;
  const visibleEnd = 4;
  const maskLength = Math.max(cleaned.length - visibleStart - visibleEnd, 4);
  const start = cleaned.slice(0, visibleStart);
  const end = cleaned.slice(-visibleEnd);
  return `${start}${"*".repeat(maskLength)}${end}`;
}
