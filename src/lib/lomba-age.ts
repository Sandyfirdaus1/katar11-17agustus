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
      // Special rule: Dewasa (21-40) can also register for Remaja (10-20)
      const isDewasaRegisteringRemaja =
        age >= 21 &&
        age <= 40 &&
        group.age === "10-20";

      if (isDirectMatch || isDewasaRegisteringRemaja) {
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
