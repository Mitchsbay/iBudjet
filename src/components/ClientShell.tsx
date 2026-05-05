"use client";

import dynamic from "next/dynamic";

const TopNav = dynamic(() => import("@/components/TopNav"), { ssr: false });
const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })),
  { ssr: false }
);

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main className="flex-1">{children}</main>
      <footer className="bg-[#0f1f35] text-gray-400 py-8 mt-16 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">iBudget</span>
              <span className="text-gray-500">—</span>
              <span className="text-sm">Australian Financial Calculators</span>
            </div>
            <p className="text-xs text-center sm:text-right max-w-md">
              All calculations are estimates only and do not constitute financial advice.
              Always seek independent professional advice before making financial decisions.
            </p>
          </div>
        </div>
      </footer>
      <Toaster richColors position="top-right" />
    </>
  );
}
