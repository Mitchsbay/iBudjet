export type CalculatorKey =
  | "mortgage"
  | "extra-repayments"
  | "borrowing-power"
  | "stamp-duty"
  | "gst"
  | "compound-interest";

export type CalculatorLink = {
  key: CalculatorKey;
  title: string;
  href: string;
  cta: string;
  keywords: string[];
};

export const CALCULATORS: CalculatorLink[] = [
  {
    key: "mortgage",
    title: "Mortgage Calculator",
    href: "/mortgage-calculator",
    cta: "Try our mortgage calculator",
    keywords: ["mortgage", "home loan", "repayment", "repayments", "interest rate", "loan term", "deposit"],
  },
  {
    key: "extra-repayments",
    title: "Extra Repayments Calculator",
    href: "/extra-repayments",
    cta: "Try our extra repayments calculator",
    keywords: ["extra repayment", "extra repayments", "pay off", "interest savings", "loan faster", "additional repayment"],
  },
  {
    key: "borrowing-power",
    title: "Borrowing Power Calculator",
    href: "/borrowing-power",
    cta: "Try our borrowing power calculator",
    keywords: ["borrowing power", "borrow", "income", "expenses", "serviceability", "bank approval", "afford"],
  },
  {
    key: "stamp-duty",
    title: "Stamp Duty Calculator",
    href: "/stamp-duty",
    cta: "Try our stamp duty calculator",
    keywords: ["stamp duty", "transfer duty", "first home buyer", "settlement", "nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"],
  },
  {
    key: "gst",
    title: "GST Calculator",
    href: "/gst-calculator",
    cta: "Try our GST calculator",
    keywords: ["gst", "goods and services tax", "tax invoice", "business", "bas", "inclusive", "exclusive"],
  },
  {
    key: "compound-interest",
    title: "Compound Interest Calculator",
    href: "/compound-interest",
    cta: "Try our compound interest calculator",
    keywords: ["compound interest", "investing", "investment", "savings", "monthly contribution", "returns", "wealth"],
  },
];

export function getCalculatorsByKeys(keys: string[] | null | undefined) {
  if (!keys?.length) return [];
  const selected = new Set(keys);
  return CALCULATORS.filter((calculator) => selected.has(calculator.key));
}
