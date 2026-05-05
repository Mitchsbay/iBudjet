import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: "First Home Buyer Guide: All Costs Explained (Australia 2026)",
  description:
    "A complete guide to every cost involved in buying your first home in Australia — stamp duty, LMI, conveyancing, inspections, and more. Includes links to free calculators.",
  keywords: [
    "first home buyer Australia",
    "first home buyer costs",
    "stamp duty first home buyer",
    "LMI Australia",
    "buying first home Australia 2026",
  ],
};

export const dynamic = "force-dynamic";

const CALC_LINKS = [
  {
    href: "/stamp-duty?buyerType=first-home-buyer",
    icon: "📋",
    label: "Stamp Duty Calculator",
    desc: "Calculate your stamp duty (or check if you qualify for a full exemption)",
  },
  {
    href: "/borrowing-power",
    icon: "📊",
    label: "Borrowing Power Calculator",
    desc: "Estimate how much a lender will let you borrow based on your income and expenses",
  },
  {
    href: "/mortgage-calculator",
    icon: "🏠",
    label: "Mortgage Repayment Calculator",
    desc: "See your monthly, fortnightly, and weekly repayments at different loan amounts",
  },
];

export default function FirstHomeBuyerGuidePage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
        <span>/</span>
        <a href="/resources" className="hover:text-blue-600 transition-colors">Guides</a>
        <span>/</span>
        <span className="text-gray-800 font-medium">First Home Buyer Guide</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
        {/* Main article */}
        <article className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full">Most Popular</span>
              <span className="text-xs text-gray-400 flex items-center gap-1">🕐 8 min read</span>
              <span className="text-xs text-gray-400">Updated 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1e3a5f] leading-tight mb-4">
              First Home Buyer Guide: All Costs Explained (Australia 2026)
            </h1>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
              Buying your first home in Australia involves far more than just the purchase price. This guide breaks down every cost you need to budget for — so you can walk into settlement with no surprises.
            </p>
          </div>

          {/* Article body */}
          <div className="prose-custom space-y-10 text-gray-700 text-sm sm:text-base leading-relaxed">

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">The True Cost of Buying Your First Home</h2>
              <p>
                Most first home buyers focus almost entirely on saving a deposit — but the purchase price is only the beginning. When you add up stamp duty, conveyancing fees, building and pest inspections, lenders mortgage insurance (LMI), and moving costs, the total upfront outlay can easily be 5–8% above the purchase price. On a $600,000 property, that means budgeting an additional $30,000–$48,000 on top of your deposit.
              </p>
              <p className="mt-3">
                Understanding each cost in advance gives you time to save appropriately, negotiate where possible, and avoid the financial stress that catches so many first home buyers off guard in the weeks before settlement.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">Stamp Duty: Your Biggest Upfront Cost</h2>
              <p>
                Stamp duty (officially called transfer duty in most states) is a state government tax on property purchases. It is typically the largest single cost outside your deposit, and the amount varies significantly depending on which state or territory you buy in, the purchase price, and whether you qualify as a first home buyer.
              </p>
              <p className="mt-3">
                Every state and territory offers some form of first home buyer concession. In New South Wales, first home buyers pay no stamp duty on properties up to $800,000. In Victoria, the threshold is $600,000. In Queensland, it is $500,000. These concessions can save you tens of thousands of dollars — but they only apply if you meet the eligibility criteria, which typically require you to be an Australian citizen or permanent resident, intend to live in the property, and never have previously owned residential property in Australia.
              </p>
              <p className="mt-3">
                Use the Stamp Duty Calculator below to see exactly what you will pay (or save) in your state.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">Lenders Mortgage Insurance (LMI)</h2>
              <p>
                If your deposit is less than 20% of the purchase price, most lenders will require you to pay Lenders Mortgage Insurance. LMI protects the lender (not you) in the event you default on the loan. Despite this, you are the one who pays the premium — which can range from a few thousand dollars to over $20,000 depending on the loan amount and your deposit size.
              </p>
              <p className="mt-3">
                For a $600,000 property with a 10% deposit ($60,000), LMI could add approximately $10,000–$14,000 to your upfront costs. Many lenders allow you to capitalise LMI into the loan, meaning you do not pay it upfront — but you will pay interest on it over the life of the loan.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">Other Costs to Budget For</h2>
              <p>
                Beyond stamp duty and LMI, first home buyers should budget for conveyancing or solicitor fees ($1,500–$3,000), building and pest inspection ($400–$800), loan application and establishment fees ($0–$1,000 depending on the lender), council and water rates adjustments at settlement, and moving costs. If you are buying a strata property, a strata report inspection is also recommended.
              </p>
              <p className="mt-3">
                A practical rule of thumb is to budget 5% of the purchase price for all upfront costs beyond your deposit, then adjust based on your specific state's stamp duty and whether LMI applies.
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
          {/* Calculator links card */}
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

          {/* Related guides */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Related Guides</h3>
            <div className="space-y-2">
              <a href="/resources/how-much-mortgage-can-you-afford" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors py-1">
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                How Much Mortgage Can You Afford?
              </a>
              <a href="/resources/stamp-duty-by-state" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors py-1">
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                Stamp Duty By State Compared
              </a>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
            <p className="font-semibold mb-1">General Information Only</p>
            <p>This guide is for educational purposes and does not constitute financial or legal advice. Costs and thresholds change regularly. Always verify with your state revenue office and seek independent advice.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
