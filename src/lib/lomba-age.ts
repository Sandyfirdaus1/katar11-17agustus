export interface LombaGroupLike {
  age: string;
  lomba: string[];
}

export function parseAgeRange(ageLabel: string): { min: number; max: number } | null {
  const normalized = ageLabel
    .replace(/[–—]/g, "-")
    .replace(/tahun|thn/gi, "")
    .trim();

  const rangeMatch = normalized.match(/^(\d+)\s*-\s*(\d+)$/);
  if (rangeMatch) {
    return { min: Number(rangeMatch[1]), max: Number(rangeMatch[2]) };
  }

  const plusMatch = normalized.match(/^(\d+)\s*\+$/);
  if (plusMatch) {
    return { min: Number(plusMatch[1]), max: Infinity };
  }

  return null;
}

export function getLombaForAge(groups: LombaGroupLike[], age: number): string[] {
  const matches: string[] = [];
  for (const group of groups) {
    const range = parseAgeRange(group.age);
    if (range) {
      const isDirectMatch = age >= range.min && age <= range.max;
      
      // Allow cross-registration between Remaja and Dewasa categories
      // Remaja (10-20) can register for Dewasa (18+)
      // Dewasa (18+) can register for Remaja (10-20)
      const isCrossRegistration = 
        (age >= 10 && age <= 20 && range.min >= 18) || // Remaja registering for Dewasa
        (age >= 18 && range.min >= 10 && range.max <= 20); // Dewasa registering for Remaja

      if (isDirectMatch || isCrossRegistration) {
        matches.push(...group.lomba);
      }
    }
  }
  return Array.from(new Set(matches));
}

export function isLombaValidForAge(
  groups: LombaGroupLike[],
  age: number,
  lomba: string
): boolean {
  return getLombaForAge(groups, age).includes(lomba);
}
