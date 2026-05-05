import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: "How Much Mortgage Can You Really Afford? Breaking the Bank's Rules",
  description:
    "Australian guide to understanding the difference between what a bank will lend you and what you can comfortably afford. Includes the APRA buffer, stress testing, and extra repayments strategy.",
  keywords: [
    "how much mortgage can I afford Australia",
    "mortgage affordability Australia",
    "APRA serviceability buffer",
    "mortgage stress test Australia",
    "borrowing capacity Australia",
  ],
};

export const dynamic = "force-dynamic";

const CALC_LINKS = [
  {
    href: "/mortgage-calculator",
    icon: "🏠",
    label: "Mortgage Repayment Calculator",
    desc: "Calculate your exact repayments at different loan amounts and interest rates",
  },
  {
    href: "/borrowing-power",
    icon: "📊",
    label: "Borrowing Power Calculator",
    desc: "See how much a lender will approve based on your income and expenses",
  },
  {
    href: "/extra-repayments",
    icon: "💰",
    label: "Extra Repayments Calculator",
    desc: "See how much time and interest you save by paying more than the minimum",
  },
];

export default function MortgageAffordabilityPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
        <span>/</span>
        <a href="/resources" className="hover:text-blue-600 transition-colors">Guides</a>
        <span>/</span>
        <span className="text-gray-800 font-medium">Mortgage Affordability</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
        {/* Main article */}
        <article className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-semibold bg-green-50 text-green-600 border border-green-100 px-2.5 py-1 rounded-full">Essential Reading</span>
              <span className="text-xs text-gray-400 flex items-center gap-1">🕐 6 min read</span>
              <span className="text-xs text-gray-400">Updated 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1e3a5f] leading-tight mb-4">
              How Much Mortgage Can You Really Afford? Breaking the Bank&apos;s Rules
            </h1>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
              Banks will tell you how much they&apos;ll lend you — but that&apos;s not the same as how much you can comfortably afford. Here&apos;s how to find your real number.
            </p>
          </div>

          {/* Article body */}
          <div className="space-y-10 text-gray-700 text-sm sm:text-base leading-relaxed">

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">Borrowing Capacity vs. True Affordability</h2>
              <p>
                When a bank tells you that you can borrow $750,000, they are telling you the maximum they are willing to lend based on their lending criteria — not the amount that will allow you to live comfortably, save for retirement, and handle unexpected expenses. These are very different numbers, and confusing them is one of the most common financial mistakes Australian home buyers make.
              </p>
              <p className="mt-3">
                True affordability is about what you can repay without sacrificing your lifestyle, your emergency fund, or your long-term financial goals. A useful starting point is the 28/36 rule: your housing costs (mortgage repayment, rates, insurance) should not exceed 28% of your gross monthly income, and your total debt obligations should not exceed 36%. These are not hard rules, but they provide a useful sanity check against the bank&apos;s maximum.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">The APRA Serviceability Buffer: What It Means for You</h2>
              <p>
                Since October 2021, all APRA-regulated lenders in Australia must assess your ability to repay at your loan&apos;s interest rate plus a 3% buffer. This means if you are applying for a loan at 6.5% p.a., the bank must confirm you can afford repayments at 9.5% p.a. This buffer is designed to protect borrowers from payment shock if rates rise — and it is one of the main reasons your approved borrowing amount is often lower than you expect.
              </p>
              <p className="mt-3">
                The buffer is not just a regulatory formality. It is actually a useful personal finance tool. If you can genuinely afford repayments at the buffer rate, you have a meaningful safety margin if rates rise, you lose income temporarily, or unexpected expenses emerge. Consider stress-testing your own budget at the buffer rate before committing to a loan.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">How Extra Repayments Change the Equation</h2>
              <p>
                One of the most powerful ways to make a large mortgage more manageable is to make extra repayments from day one. Even $200–$500 per month above the minimum repayment can shave years off a 30-year loan and save tens of thousands in interest. This strategy also builds a buffer of equity and, if your loan has a redraw facility, gives you access to funds in an emergency.
              </p>
              <p className="mt-3">
                The key insight is that the &quot;affordability&quot; question is not just about whether you can make the minimum repayment — it is about whether you can make the minimum repayment and still build financial resilience. Use the Extra Repayments Calculator to model how different additional payment amounts affect your total interest and loan term.
              </p>
            </section>

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
              <h3 className="font-semibold text-gray-800 text-sm">Related Calculators</h3>
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

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Related Guides</h3>
            <div className="space-y-2">
              <a href="/resources/first-home-buyer-guide" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors py-1">
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                First Home Buyer: All Costs Explained
              </a>
              <a href="/resources/compound-interest-explained" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors py-1">
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                Compound Interest Explained
              </a>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
            <p className="font-semibold mb-1">General Information Only</p>
            <p>This guide is for educational purposes and does not constitute financial advice. Lending criteria vary between lenders and change over time. Always seek independent advice from a licensed mortgage broker or financial adviser.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
