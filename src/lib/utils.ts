import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmtAUD(n: number, decimals = 0): string {
  return n.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtAUDExact(n: number): string {
  return fmtAUD(n, 2);
}

export function monthsToYearsMonths(months: number): string {
  const y = Math.floor(months / 12);
  const m = Math.round(months % 12);
  if (y === 0) return `${m} month${m !== 1 ? "s" : ""}`;
  if (m === 0) return `${y} year${y !== 1 ? "s" : ""}`;
  return `${y} yr${y !== 1 ? "s" : ""} ${m} mo`;
}

export const CALCULATOR_META: Record<
  string,
  { label: string; href: string; icon: string; description: string }
> = {
  mortgage: {
    label: "Mortgage Repayment",
    href: "/mortgage-calculator",
    icon: "🏠",
    description: "Calculate monthly, fortnightly, and weekly repayments with a full amortisation schedule.",
  },
  "extra-repayments": {
    label: "Extra Repayments",
    href: "/extra-repayments",
    icon: "💰",
    description: "See how much time and interest you save by making additional mortgage repayments.",
  },
  "borrowing-power": {
    label: "Borrowing Power",
    href: "/borrowing-power",
    icon: "📊",
    description: "Estimate your maximum borrowing capacity based on income, expenses, and dependants.",
  },
  "stamp-duty": {
    label: "Stamp Duty",
    href: "/stamp-duty",
    icon: "📋",
    description: "Calculate stamp duty for all Australian states and territories by buyer type.",
  },
  gst: {
    label: "GST Calculator",
    href: "/gst-calculator",
    icon: "🧾",
    description: "Quickly add or remove GST from any amount and see the full breakdown.",
  },
  "compound-interest": {
    label: "Compound Interest",
    href: "/compound-interest",
    icon: "📈",
    description: "Project the future value of your investment with a detailed growth chart.",
  },
};
