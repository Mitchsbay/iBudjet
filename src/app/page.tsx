export const dynamic = "force-dynamic";


import { ArrowRight, Shield, Zap, Smartphone } from "lucide-react";

const CALCULATORS = [
  {
    href: "/mortgage-calculator",
    icon: "🏠",
    title: "Mortgage Repayment",
    description:
      "Calculate monthly, fortnightly, and weekly repayments. Includes a full amortisation schedule and accelerated repayment savings.",
    badge: "ASIC Compliant",
  },
  {
    href: "/extra-repayments",
    icon: "💰",
    title: "Extra Repayments",
    description:
      "Find out how much time and interest you save by making additional repayments on your mortgage.",
    badge: null,
  },
  {
    href: "/borrowing-power",
    icon: "📊",
    title: "Borrowing Power",
    description:
      "Estimate your maximum borrowing capacity based on income, expenses, dependants, and the APRA 3% buffer.",
    badge: "ASIC Compliant",
  },
  {
    href: "/stamp-duty",
    icon: "📋",
    title: "Stamp Duty",
    description:
      "Calculate stamp duty for all 8 Australian states and territories. Covers first home buyers, owner-occupiers, and investors.",
    badge: "All States",
  },
  {
    href: "/gst-calculator",
    icon: "🧾",
    title: "GST Calculator",
    description:
      "Instantly add or remove 10% GST from any amount and see the pre-GST, GST component, and total breakdown.",
    badge: null,
  },
  {
    href: "/compound-interest",
    icon: "📈",
    title: "Compound Interest",
    description:
      "Project the future value of your investment with principal, contributions, rate, and compounding frequency.",
    badge: "With Chart",
  },
];

const FEATURES = [
  {
    icon: <Zap className="w-5 h-5 text-blue-500" />,
    title: "Real-time Results",
    description: "Every calculation updates instantly as you type — no submit button required.",
  },
  {
    icon: <Shield className="w-5 h-5 text-green-500" />,
    title: "ASIC Compliant",
    description: "Mortgage and borrowing power calculators include required ASIC disclaimers.",
  },
  {
    icon: <Smartphone className="w-5 h-5 text-purple-500" />,
    title: "Mobile Friendly",
    description: "Fully responsive design works seamlessly on phones, tablets, and desktops.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f1f35] via-[#1e3a5f] to-[#2563eb] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Free Australian Financial Calculators
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Smart tools for{" "}
            <span className="text-blue-300">smarter</span>
            <br />
            financial decisions
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            iBudget offers six powerful calculators designed for Australian home buyers,
            investors, and everyday users. Free, fast, and built with accuracy in mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/mortgage-calculator"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1e3a5f] font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Start Calculating <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#calculators"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              View All Tools
            </a>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-white border-b border-gray-100 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="mt-0.5 p-2 bg-gray-50 rounded-lg">{f.icon}</div>
              <div>
                <p className="font-semibold text-gray-900">{f.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Calculator cards */}
      <section id="calculators" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e3a5f] mb-3">All Calculators</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Choose a calculator below to get started. All tools are free, require no sign-up,
              and work entirely in your browser.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CALCULATORS.map((c) => (
              <a
                key={c.href}
                href={c.href}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{c.icon}</span>
                  {c.badge && (
                    <span className="text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full">
                      {c.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {c.title}
                </h3>
                <p className="text-sm text-gray-500 flex-1 leading-relaxed">{c.description}</p>
                <div className="mt-4 flex items-center gap-1 text-blue-600 text-sm font-medium">
                  Open calculator <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Save results CTA */}
      <section className="bg-[#1e3a5f] text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Save &amp; Compare Your Results</h2>
          <p className="text-blue-200 mb-8">
            Sign in with Google to save your calculations and load them back at any time.
            Compare different scenarios side by side.
          </p>
          <a
            href="/mortgage-calculator"
            className="inline-flex items-center gap-2 bg-white text-[#1e3a5f] font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Get Started — It&apos;s Free <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </>
  );
}
