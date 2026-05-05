import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: "Stamp Duty By State: NSW, VIC, QLD, WA, SA, TAS, ACT, NT Compared (2026)",
  description:
    "Compare stamp duty rates across all 8 Australian states and territories. Includes first home buyer concessions, thresholds, and links to each state's revenue office.",
  keywords: [
    "stamp duty by state Australia",
    "stamp duty NSW VIC QLD",
    "stamp duty comparison Australia 2026",
    "transfer duty Australia",
    "first home buyer stamp duty exemption",
  ],
};

export const dynamic = "force-dynamic";

const STATE_DATA = [
  {
    state: "NSW",
    name: "New South Wales",
    calcHref: "/stamp-duty?state=NSW",
    revenueUrl: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty",
    fhbThreshold: "$800,000 (new homes)",
    fhbConcession: "Full exemption up to $800k; concession up to $1M. Option for annual property tax instead of upfront duty.",
    exampleDuty: "$29,055",
    examplePrice: "$750,000",
    highlight: true,
  },
  {
    state: "VIC",
    name: "Victoria",
    calcHref: "/stamp-duty?state=VIC",
    revenueUrl: "https://www.sro.vic.gov.au/land-transfer-duty",
    fhbThreshold: "$600,000",
    fhbConcession: "Full exemption up to $600k; sliding scale concession up to $750k.",
    exampleDuty: "$36,830",
    examplePrice: "$680,000",
    highlight: false,
  },
  {
    state: "QLD",
    name: "Queensland",
    calcHref: "/stamp-duty?state=QLD",
    revenueUrl: "https://www.qld.gov.au/housing/buying-owning-home/advice-buying-home/transfer-duty",
    fhbThreshold: "$500,000",
    fhbConcession: "Full exemption up to $500k; concession up to $550k. Owner-occupied only.",
    exampleDuty: "$17,325",
    examplePrice: "$600,000",
    highlight: false,
  },
  {
    state: "WA",
    name: "Western Australia",
    calcHref: "/stamp-duty?state=WA",
    revenueUrl: "https://www.wa.gov.au/service/financial-management/taxation/transfer-duty-calculator",
    fhbThreshold: "$430,000",
    fhbConcession: "Full exemption up to $430k; concession up to $530k.",
    exampleDuty: "$19,665",
    examplePrice: "$600,000",
    highlight: false,
  },
  {
    state: "SA",
    name: "South Australia",
    calcHref: "/stamp-duty?state=SA",
    revenueUrl: "https://www.revenuesa.sa.gov.au/taxes-and-duties/stamp-duties/real-property",
    fhbThreshold: "No specific concession",
    fhbConcession: "No dedicated stamp duty concession. First Home Owner Grant may apply for new builds.",
    exampleDuty: "$21,330",
    examplePrice: "$600,000",
    highlight: false,
  },
  {
    state: "TAS",
    name: "Tasmania",
    calcHref: "/stamp-duty?state=TAS",
    revenueUrl: "https://www.sro.tas.gov.au/duties/",
    fhbThreshold: "$600,000 (50% concession)",
    fhbConcession: "50% concession on stamp duty for established homes up to $600k.",
    exampleDuty: "$15,560",
    examplePrice: "$600,000",
    highlight: false,
  },
  {
    state: "ACT",
    name: "Australian Capital Territory",
    calcHref: "/stamp-duty?state=ACT",
    revenueUrl: "https://www.revenue.act.gov.au/duties/conveyance-duty",
    fhbThreshold: "$1,000,000",
    fhbConcession: "Full exemption under the Home Buyer Concession Scheme, subject to income and property value caps.",
    exampleDuty: "$22,300",
    examplePrice: "$600,000",
    highlight: false,
  },
  {
    state: "NT",
    name: "Northern Territory",
    calcHref: "/stamp-duty?state=NT",
    revenueUrl: "https://nt.gov.au/property/buying-or-selling-a-property/stamp-duty",
    fhbThreshold: "$650,000",
    fhbConcession: "Full exemption on first $650k under the Territory Home Owner Discount.",
    exampleDuty: "$29,700",
    examplePrice: "$600,000",
    highlight: false,
  },
];

export default function StampDutyByStatePage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
        <span>/</span>
        <a href="/resources" className="hover:text-blue-600 transition-colors">Guides</a>
        <span>/</span>
        <span className="text-gray-800 font-medium">Stamp Duty By State</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
        {/* Main article */}
        <article className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-full">Updated 2026</span>
              <span className="text-xs text-gray-400 flex items-center gap-1">🕐 7 min read</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1e3a5f] leading-tight mb-4">
              Stamp Duty By State: NSW, VIC, QLD, WA, SA, TAS, ACT, NT Compared
            </h1>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
              Stamp duty varies dramatically across Australia. A $700,000 property can attract anywhere from $0 to over $30,000 depending on where you buy and whether you qualify as a first home buyer.
            </p>
          </div>

          {/* Article body */}
          <div className="space-y-10 text-gray-700 text-sm sm:text-base leading-relaxed">

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">Why Stamp Duty Varies So Much Between States</h2>
              <p>
                Stamp duty is a state and territory tax, which means each of Australia&apos;s eight jurisdictions sets its own rates, brackets, and concessions independently. There is no federal standard. This creates significant variation: a first home buyer purchasing a $500,000 property in New South Wales may pay nothing, while the same buyer in South Australia (which has no first home buyer stamp duty concession) would pay approximately $21,330.
              </p>
              <p className="mt-3">
                The variation is not just about the headline rate — it also reflects different bracket structures, different concession thresholds, and different definitions of who qualifies as a first home buyer. Understanding the rules in your specific state is essential before you commit to a purchase price.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">State-by-State Comparison</h2>
              <p className="mb-5">
                The table below summarises the first home buyer concession threshold and an indicative stamp duty amount for each state and territory. Use the calculator links to get an exact figure for your purchase price.
              </p>

              <div className="space-y-4">
                {STATE_DATA.map((s) => (
                  <div
                    key={s.state}
                    className={`rounded-2xl border p-5 ${s.highlight ? "border-blue-200 bg-blue-50" : "border-gray-100 bg-white"} shadow-sm`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">
                          {s.state} — {s.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Example: {s.exampleDuty} on a {s.examplePrice} property (owner-occupier, non-FHB)
                        </p>
                      </div>
                      <a
                        href={s.calcHref}
                        className="shrink-0 inline-flex items-center gap-1 bg-[#1e3a5f] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap"
                      >
                        <Calculator className="w-3 h-3" />
                        Calculate
                      </a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">FHB Exemption Threshold</p>
                        <p className="text-gray-700 font-medium">{s.fhbThreshold}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Concession Details</p>
                        <p className="text-gray-600 text-xs leading-relaxed">{s.fhbConcession}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <a
                        href={s.revenueUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Official {s.state} Revenue Office →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">When Is Stamp Duty Due?</h2>
              <p>
                Stamp duty is generally due at or shortly after settlement. In New South Wales, it must be paid within three months of the contract date. In Victoria and Queensland, it is due within 30 days of settlement. Failing to pay on time attracts penalties and interest, so it is important to have the funds ready well before settlement day. Your conveyancer or solicitor will typically arrange payment on your behalf as part of the settlement process.
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
              <h3 className="font-semibold text-gray-800 text-sm">Calculate by State</h3>
            </div>
            <div className="space-y-2">
              {STATE_DATA.map((s) => (
                <a
                  key={s.state}
                  href={s.calcHref}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all group text-sm"
                >
                  <span className="font-medium text-gray-700 group-hover:text-blue-700">{s.state}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
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
              <a href="/resources/how-much-mortgage-can-you-afford" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors py-1">
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                How Much Mortgage Can You Afford?
              </a>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
            <p className="font-semibold mb-1">Rates Change Regularly</p>
            <p>Stamp duty rates, thresholds, and concessions are set by state governments and change regularly. Always verify with the official state revenue office before exchanging contracts.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
