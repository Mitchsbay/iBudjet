import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Mortgage Repayment Calculator",
  description: "Calculate monthly, fortnightly, and weekly mortgage repayments with a full amortisation schedule. Includes ASIC disclaimer.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
