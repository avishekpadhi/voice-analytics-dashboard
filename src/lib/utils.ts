import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ProcessedData<T extends { count: number; category: string }> {
  processed: (T & { percentage: number })[];
  total: number;
}

export function processData<T extends { category: string; count: number }>(
  data: T[]
): ProcessedData<T> {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  const enriched = data
    .map((d) => ({
      ...d,
      percentage: total ? (d.count / total) * 100 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const top20 = enriched.slice(0, 20);
  const others = enriched.slice(20);

  if (others.length > 0) {
    const otherSum = others.reduce((sum, d) => sum + d.count, 0);
    top20.push({
      category: "Others",
      count: otherSum,
      percentage: total ? (otherSum / total) * 100 : 0,
    } as any);
  }

  return { processed: top20, total };
}
