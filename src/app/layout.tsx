import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/apple-touch-icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  title: {
    default: "iBudget — Australian Financial Calculators",
    template: "%s | iBudget",
  },
  description:
    "Free Australian financial calculators: mortgage repayments, borrowing power, stamp duty, GST, compound interest, and extra repayments.",
  keywords: [
    "mortgage calculator",
    "stamp duty calculator",
    "borrowing power",
    "GST calculator",
    "compound interest",
    "Australian financial calculators",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <ClientProviders>
          <main className="flex-1">{children}</main>
          <footer className="bg-[#0f1f35] text-gray-400 py-8 mt-16 no-print">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center gap-2 sm:justify-start">
                    <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663103082589/i9pjha3mPG3kKNqGtavWgT/ibudget-favicon-9XmJnkq2QqT4BJaJYjuztJ.png" alt="iBudget" className="h-7 w-7 rounded-md" />
                    <span className="text-white font-bold text-lg">iBudget</span>
                    <span className="text-gray-500">—</span>
                    <span className="text-sm">Australian Financial Calculators</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:justify-start">
                    <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="/terms-of-use" className="hover:text-white transition-colors">Terms of Use</a>
                    <a href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</a>
                  </div>
                </div>
                <p className="text-xs text-center sm:text-right max-w-md">
                  All calculations are estimates only and do not constitute financial advice.
                  Always seek independent professional advice before making financial decisions.
                </p>
              </div>
            </div>
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}
