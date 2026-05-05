import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: "Compound Interest Explained: Why $100 a Month Makes You a Millionaire",
  description:
    "A plain-English guide to compound interest for Australian investors. Covers the Rule of 72, superannuation, ETFs, and why starting early matters more than the amount you invest.",
  keywords: [
    "compound interest explained Australia",
    "compound interest calculator Australia",
    "rule of 72 Australia",
    "superannuation compound interest",
    "investing $100 a month Australia",
  ],
};

export const dynamic = "force-dynamic";

const CALC_LINKS = [
  {
    href: "/compound-interest",
    icon: "📈",
    label: "Compound Interest Calculator",
    desc: "Project the future value of any investment with regular contributions and compounding",
  },
];

const EXAMPLES = [
  { label: "Start at 25, invest $200/month at 8% p.a.", result: "~$702,000 by age 65" },
  { label: "Start at 35, invest $200/month at 8% p.a.", result: "~$298,000 by age 65" },
  { label: "Start at 45, invest $200/month at 8% p.a.", result: "~$119,000 by age 65" },
];

export default function CompoundInterestExplainedPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
        <span>/</span>
        <a href="/resources" className="hover:text-blue-600 transition-colors">Guides</a>
        <span>/</span>
        <span className="text-gray-800 font-medium">Compound Interest Explained</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
        {/* Main article */}
        <article className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-100 px-2.5 py-1 rounded-full">Investing</span>
              <span className="text-xs text-gray-400 flex items-center gap-1">🕐 5 min read</span>
              <span className="text-xs text-gray-400">Updated 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1e3a5f] leading-tight mb-4">
              Compound Interest Explained: Why $100 a Month Makes You a Millionaire
            </h1>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
              Compound interest is the most powerful force in personal finance. Here&apos;s how it works, why starting early matters more than the amount you invest, and how it applies to your super, ETFs, and savings.
            </p>
          </div>

          {/* Article body */}
          <div className="space-y-10 text-gray-700 text-sm sm:text-base leading-relaxed">

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">What Is Compound Interest?</h2>
              <p>
                Simple interest is calculated only on your original principal. Compound interest is calculated on your principal <em>plus</em> all the interest you have already earned. This seemingly small difference creates an exponential growth curve that, given enough time, produces results that feel almost magical.
              </p>
              <p className="mt-3">
                Imagine you invest $10,000 at 8% per year. In year one, you earn $800 in interest, giving you $10,800. In year two, you earn 8% on $10,800 — not just on the original $10,000 — so you earn $864. By year ten, your annual interest earnings have grown to over $1,600, even though you never added another dollar. By year twenty, your $10,000 has grown to approximately $46,600. This is compound interest at work.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">The Rule of 72: A Simple Mental Shortcut</h2>
              <p>
                The Rule of 72 lets you estimate how long it takes for an investment to double. Simply divide 72 by the annual interest rate. At 8% p.a., your money doubles in approximately 9 years. At 6%, it takes 12 years. At 4%, it takes 18 years.
              </p>
              <p className="mt-3">
                This rule also works in reverse for debt: a credit card charging 20% interest will double your balance in just 3.6 years if you make no payments. Understanding the Rule of 72 helps you quickly compare investment options and understand the true cost of high-interest debt.
              </p>
            </section>

            {/* Visual example */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">Why Starting Early Matters More Than the Amount</h2>
              <p className="mb-5">
                The single most important variable in compound interest is time. The following examples show how the same $200 monthly investment at 8% p.a. produces dramatically different outcomes depending on when you start:
              </p>
              <div className="space-y-3">
                {EXAMPLES.map((ex) => (
                  <div key={ex.label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm">
                    <p className="text-sm text-gray-700">{ex.label}</p>
                    <p className="text-base font-bold text-[#1e3a5f] sm:text-right shrink-0">{ex.result}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Starting at 25 instead of 35 produces more than twice the final balance — despite only investing for an extra 10 years. This is the compounding effect in action.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">Compound Interest in Your Super and ETF Portfolio</h2>
              <p>
                For Australians, the most significant application of compound interest is superannuation. Your employer&apos;s compulsory contributions, combined with any voluntary top-ups, compound inside a tax-advantaged environment over a working lifetime of 40+ years. The ATO estimates that a 1% difference in annual super fees can cost a typical worker over $100,000 by retirement — purely because of compounding.
              </p>
              <p className="mt-3">
                Outside of super, low-cost ETFs tracking the ASX 200 or global indices have historically delivered long-term returns of 7–10% per annum before inflation. When dividends are reinvested (through a dividend reinvestment plan or manually), the compounding effect is amplified. The key is consistency: regular contributions, low fees, and a long time horizon consistently outperform attempts to time the market.
              </p>
            </section>

          </div>

          {/* CTA */}
          <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-bold text-[#1e3a5f] mb-2">See Your Numbers</h3>
            <p className="text-sm text-gray-600 mb-4">
              Use the free Compound Interest Calculator to model your own investment scenario — adjust the initial amount, monthly contributions, interest rate, and compounding frequency.
            </p>
            <a
              href="/compound-interest"
              className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors text-sm"
            >
              Open Calculator <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <a href="/resources" className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to all guides
            </a>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="w-full lg:w-72 lg:shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-gray-800 text-sm">Related Calculator</h3>
            </div>
            <div className="space-y-3">
              {CALC_LINKS.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all group"
                >
                  <span className="text-xl shrink-0">{c.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors leading-tight">
                      {c.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">{c.desc}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 shrink-0 mt-0.5 ml-auto" />
                </a>
              ))}
            </div>
          </div>

          {/* Rule of 72 quick ref */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Rule of 72 Quick Reference</h3>
            <div className="space-y-2 text-sm">
              {[
                { rate: "4%", years: "18 years" },
                { rate: "6%", years: "12 years" },
                { rate: "8%", years: "9 years" },
                { rate: "10%", years: "7.2 years" },
                { rate: "12%", years: "6 years" },
              ].map((r) => (
                <div key={r.rate} className="flex justify-between text-gray-600">
                  <span>{r.rate} p.a.</span>
                  <span className="font-medium text-gray-800">doubles in {r.years}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Related Guides</h3>
            <div className="space-y-2">
              <a href="/resources/how-much-mortgage-can-you-afford" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors py-1">
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                How Much Mortgage Can You Afford?
              </a>
              <a href="/resources/first-home-buyer-guide" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors py-1">
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                First Home Buyer Guide
              </a>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
            <p className="font-semibold mb-1">General Information Only</p>
            <p>Investment returns are not guaranteed and past performance is not indicative of future results. This guide is for educational purposes only. Always seek advice from a licensed financial adviser.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
