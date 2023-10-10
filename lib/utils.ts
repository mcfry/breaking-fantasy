import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateTime } from "luxon";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMongoDate(mongoDate: Date) {
  const date = new Date(mongoDate);
  const luxonDate = DateTime.fromJSDate(date);

  return luxonDate.toFormat("yyyy-MM-dd - HH:mm:ss");
}

export function xorLists<T>(list1: T[], list2: T[]) {
  const result: T[] = [];

  result.push(...list1.filter((item) => !list2.includes(item)));
  result.push(...list2.filter((item) => !list1.includes(item)));

  return result;
}
