"use client";


import { useState, useMemo, useCallback } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SaveLoadButtons from "@/components/SaveLoadButtons";
import { fmtAUDExact } from "@/lib/utils";

type Mode = "add" | "remove";

export default function GSTCalculator() {
  const [amount, setAmount] = useState("100");
  const [mode, setMode] = useState<Mode>("add");

  const result = useMemo(() => {
    const val = parseFloat(amount.replace(/,/g, "")) || 0;
    if (!val) return null;
    if (mode === "add") {
      const gst = val * 0.1;
      return { preGST: val, gst, total: val + gst };
    } else {
      const preGST = val / 1.1;
      const gst = val - preGST;
      return { preGST, gst, total: val };
    }
  }, [amount, mode]);

  const handleLoad = useCallback((inputData: Record<string, unknown>) => {
    if (inputData.amount) setAmount(String(inputData.amount));
    if (inputData.mode) setMode(inputData.mode as Mode);
  }, []);

  const inputData = { amount, mode };
  const resultData = result ? { gst: result.gst, total: result.total } : {};

  return (
    <CalculatorLayout
      title="GST Calculator"
      description="Quickly add or remove 10% GST from any amount and see the full breakdown."
      icon="🧾"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">GST Calculation</h2>

          {/* Mode toggle */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("add")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  mode === "add" ? "bg-[#1e3a5f] text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Add GST
              </button>
              <button
                onClick={() => setMode("remove")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  mode === "remove" ? "bg-[#1e3a5f] text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Remove GST
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {mode === "add" ? "Amount (excl. GST)" : "Amount (incl. GST)"}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
                step={0.01}
              />
            </div>
          </div>

          <div className="mt-4">
            <SaveLoadButtons calculatorType="gst" inputData={inputData} resultData={resultData} onLoad={handleLoad} />
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Breakdown</h3>
            </div>
            <div className="divide-y divide-gray-50">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                <span className="text-gray-600 text-sm">Amount (excl. GST)</span>
                <span className="font-semibold text-gray-900">{fmtAUDExact(result.preGST)}</span>
              </div>
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-amber-50">
                <span className="text-amber-700 text-sm font-medium">GST (10%)</span>
                <span className="font-bold text-amber-700">{fmtAUDExact(result.gst)}</span>
              </div>
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-[#1e3a5f]">
                <span className="text-blue-200 text-sm font-medium">Total (incl. GST)</span>
                <span className="font-bold text-white text-lg">{fmtAUDExact(result.total)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
          GST (Goods and Services Tax) is a broad-based tax of 10% on most goods, services and other items sold or consumed in Australia.
          Administered by the Australian Taxation Office (ATO). Some items are GST-free (e.g. basic food, medical services, education).
        </div>
      </div>

      {/* ── Educational Content ── */}
      <div className="mt-10 space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">Understanding GST in Australia</h2>
          <p>
            The Goods and Services Tax (GST) is a broad-based consumption tax of 10% applied to most goods, services, and other items sold or consumed in Australia. Introduced on 1 July 2000 under the A New Tax System (Goods and Services Tax) Act 1999, GST replaced a complex web of wholesale sales taxes and is administered by the Australian Taxation Office (ATO). When a GST-registered business sells a taxable supply, it collects 10% GST from the buyer and remits this to the ATO, less any GST credits it has claimed for business purchases. The end consumer ultimately bears the cost of GST, while registered businesses act as collection agents for the government.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">GST-Free Supplies in Australia</h3>
          <p className="mb-3">
            Not all goods and services attract GST. The ATO classifies certain supplies as GST-free, meaning the seller does not charge GST and the buyer pays no GST, but the seller can still claim input tax credits on related business purchases. The most significant GST-free categories include:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1e3a5f] text-white">
                  <th className="text-left px-3 py-2 rounded-tl-lg">Category</th>
                  <th className="text-left px-3 py-2 rounded-tr-lg">Examples</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-white"><td className="px-3 py-2 font-medium">Basic food</td><td className="px-3 py-2">Fresh fruit and vegetables, bread, milk, meat, fish, eggs. Excludes restaurant meals, hot takeaway food, confectionery, and soft drinks.</td></tr>
                <tr className="bg-gray-50"><td className="px-3 py-2 font-medium">Medical services</td><td className="px-3 py-2">Most services provided by a registered medical practitioner, nurse, dentist, or optometrist. Excludes cosmetic surgery.</td></tr>
                <tr className="bg-white"><td className="px-3 py-2 font-medium">Education</td><td className="px-3 py-2">Tuition fees at primary, secondary, and tertiary institutions. Excludes private tutoring and some vocational courses.</td></tr>
                <tr className="bg-gray-50"><td className="px-3 py-2 font-medium">Exports</td><td className="px-3 py-2">Goods exported from Australia and most services provided to non-residents outside Australia.</td></tr>
                <tr className="bg-white"><td className="px-3 py-2 font-medium">Childcare</td><td className="px-3 py-2">Approved childcare services, including long day care and family day care.</td></tr>
                <tr className="bg-gray-50"><td className="px-3 py-2 font-medium">Residential rent</td><td className="px-3 py-2">Renting a residential property for use as a home. Commercial property leases are taxable.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">When Must a Business Register for GST?</h3>
          <p>
            A business must register for GST if its annual turnover is $75,000 or more (or $150,000 for non-profit organisations). Businesses with turnover below this threshold may voluntarily register. Once registered, the business must charge GST on taxable supplies, issue tax invoices for sales over $82.50 (including GST), and lodge a Business Activity Statement (BAS) with the ATO — either monthly, quarterly, or annually depending on the business’s size and preference. Taxi and ride-sharing drivers must register for GST regardless of their turnover.
          </p>
          <p className="mt-3">
            Registered businesses can claim input tax credits for the GST included in the price of goods and services they purchase for business use. This mechanism ensures that GST is only borne by the final consumer and is not cascaded through the supply chain.
          </p>
        </section>

        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-3">Worked Example</h3>
          <p className="mb-3">
            <strong>Scenario:</strong> A plumber charges $1,500 for labour and $300 for materials (both excluding GST). He is GST-registered.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1e3a5f] text-white">
                  <th className="text-left px-3 py-2 rounded-tl-lg">Item</th>
                  <th className="text-right px-3 py-2">Excl. GST</th>
                  <th className="text-right px-3 py-2 rounded-tr-lg">Incl. GST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-white"><td className="px-3 py-2">Labour</td><td className="text-right px-3 py-2">$1,500.00</td><td className="text-right px-3 py-2">$1,650.00</td></tr>
                <tr className="bg-gray-50"><td className="px-3 py-2">Materials</td><td className="text-right px-3 py-2">$300.00</td><td className="text-right px-3 py-2">$330.00</td></tr>
                <tr className="bg-white font-semibold"><td className="px-3 py-2">Total</td><td className="text-right px-3 py-2">$1,800.00</td><td className="text-right px-3 py-2">$1,980.00</td></tr>
                <tr className="bg-amber-50 text-amber-700"><td className="px-3 py-2">GST collected</td><td className="text-right px-3 py-2" colSpan={2}>$180.00</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm">
            The plumber remits $180 to the ATO via his BAS, less any input tax credits he can claim on GST-inclusive business purchases (e.g. if he paid $110 including $10 GST for tools, he can claim back that $10, reducing his net GST liability to $170).
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-3">Key Terms</h3>
          <dl className="space-y-3">
            <div>
              <dt className="font-semibold text-gray-900">Taxable Supply</dt>
              <dd className="text-gray-600 mt-0.5">A sale of goods or services that is subject to GST. The seller must charge 10% GST and remit it to the ATO.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">GST-Free Supply</dt>
              <dd className="text-gray-600 mt-0.5">A sale where no GST is charged, but the seller can still claim input tax credits on related purchases. Common examples include basic food, medical services, and education.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Input Tax Credit (ITC)</dt>
              <dd className="text-gray-600 mt-0.5">A credit that a GST-registered business can claim for the GST included in the price of goods and services purchased for business use. ITCs offset the GST the business must remit to the ATO.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Business Activity Statement (BAS)</dt>
              <dd className="text-gray-600 mt-0.5">A form lodged with the ATO by GST-registered businesses to report and pay GST collected, claim input tax credits, and report other tax obligations such as PAYG withholding.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Tax Invoice</dt>
              <dd className="text-gray-600 mt-0.5">A document issued by a GST-registered supplier for sales over $82.50 (including GST). The buyer needs a valid tax invoice to claim an input tax credit.</dd>
            </div>
          </dl>
        </section>

        <p className="text-xs text-gray-400">
          This content is for general information only. GST rules are complex and subject to change. Always consult the ATO website or a registered tax agent for advice specific to your business circumstances.
        </p>
      </div>
    </CalculatorLayout>
  );
}
