"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CALCULATORS = [
  { href: "/mortgage-calculator", label: "Mortgage Repayment", icon: "🏠" },
  { href: "/extra-repayments", label: "Extra Repayments", icon: "💰" },
  { href: "/borrowing-power", label: "Borrowing Power", icon: "📊" },
  { href: "/stamp-duty", label: "Stamp Duty", icon: "📋" },
  { href: "/gst-calculator", label: "GST Calculator", icon: "🧾" },
  { href: "/compound-interest", label: "Compound Interest", icon: "📈" },
];

export default function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      <nav className="bg-[#1e3a5f] text-white shadow-lg sticky top-0 z-50 no-print">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight hover:opacity-90 transition-opacity shrink-0"
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663103082589/i9pjha3mPG3kKNqGtavWgT/ibudget-favicon-9XmJnkq2QqT4BJaJYjuztJ.png"
                alt="iBudget"
                className="h-7 w-7 rounded-lg"
              />
              <span>iBudget</span>
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Calculators dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
                >
                  Calculators
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform shrink-0",
                      dropdownOpen && "rotate-180"
                    )}
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                    {CALCULATORS.map((c) => (
                      <a
                        key={c.href}
                        href={c.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors",
                          pathname === c.href && "bg-blue-50 text-blue-700 font-medium"
                        )}
                      >
                        <span>{c.icon}</span>
                        {c.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Resources link */}
              <a
                href="/resources"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap",
                  pathname.startsWith("/resources") && "bg-white/10 text-white"
                )}
              >
                <BookOpen className="w-4 h-4" />
                Resources
              </a>
            </div>

            {/* Hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#162d4a]">
            <div className="py-2">
              <p className="px-4 pt-2 pb-1 text-xs font-semibold text-blue-300 uppercase tracking-wider">
                Calculators
              </p>
              {CALCULATORS.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
                    pathname === c.href
                      ? "text-white bg-white/10"
                      : "text-blue-100 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span className="text-base">{c.icon}</span>
                  {c.label}
                </a>
              ))}
            </div>

            <div className="border-t border-white/10 px-4 py-3">
              <a
                href="/resources"
                onClick={handleNavClick}
                className={cn(
                  "flex items-center gap-2.5 w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-colors",
                  pathname.startsWith("/resources")
                    ? "text-white bg-white/10"
                    : "text-blue-100 hover:text-white hover:bg-white/5"
                )}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                Resources & Guides
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
