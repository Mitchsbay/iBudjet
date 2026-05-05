"use client";

import { Printer } from "lucide-react";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  icon: string;
  showAsicDisclaimer?: boolean;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function CalculatorLayout({
  title,
  description,
  icon,
  showAsicDisclaimer = false,
  children,
  sidebar,
}: CalculatorLayoutProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header ad placeholder — leaderboard, constrained and never wider than viewport */}
      <div className="ad-placeholder h-[60px] sm:h-[90px] w-full max-w-[728px] mx-auto mb-6 sm:mb-8 no-print text-xs sm:text-sm">
        ADVERTISEMENT — 728×90
      </div>

      {/* Page header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <span className="text-2xl sm:text-3xl">{icon}</span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1e3a5f] leading-tight">
            {title}
          </h1>
        </div>
        <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      {/* Main content + sidebar — stacked on mobile, side-by-side on lg+ */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Calculator content */}
        <div className="flex-1 min-w-0 overflow-hidden">{children}</div>

        {/* Sidebar — full width on mobile, fixed width on desktop */}
        <aside className="w-full lg:w-72 lg:shrink-0 space-y-4 sm:space-y-6 no-print">
          {/* Sidebar ad placeholder — rectangle */}
          <div className="ad-placeholder h-[200px] sm:h-[250px] w-full lg:max-w-[300px] mx-auto lg:mx-0">
            ADVERTISEMENT — 300×250
          </div>

          {sidebar}

          {/* Print button */}
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 w-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 rounded-xl px-4 py-3 text-sm font-medium transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 shrink-0" />
            Print / Save as PDF
          </button>

          {/* ASIC disclaimer */}
          {showAsicDisclaimer && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
              <p className="font-semibold mb-1">ASIC Disclaimer</p>
              <p>
                This calculator provides estimates only and does not constitute
                financial advice. Results are based on the information you
                provide and may not reflect your actual financial situation.
                Interest rates, fees, and lending criteria vary between lenders
                and change over time. You should seek independent financial
                advice from a licensed adviser before making any financial
                decisions.
              </p>
              <p className="mt-2">
                Australian Credit Licence requirements apply to credit
                providers. This tool is provided for general information
                purposes only in accordance with ASIC guidelines.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
