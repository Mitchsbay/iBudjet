"use client";


import { useState, useMemo, useCallback } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SaveLoadButtons from "@/components/SaveLoadButtons";
import { fmtAUD } from "@/lib/utils";

type State = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";
type BuyerType = "first-home-buyer" | "owner-occupier" | "investor";

function calcStampDuty(state: State, value: number, buyerType: BuyerType): number {
  if (value <= 0) return 0;

  switch (state) {
    case "NSW": {
      if (buyerType === "first-home-buyer" && value <= 800000) return 0;
      if (buyerType === "first-home-buyer" && value <= 1000000) {
        const full = calcNSWFull(value);
        return full * ((value - 800000) / 200000);
      }
      return calcNSWFull(value);
    }
    case "VIC": {
      if (buyerType === "first-home-buyer" && value <= 600000) return 0;
      if (buyerType === "first-home-buyer" && value <= 750000) {
        const full = calcVICFull(value);
        return full * ((value - 600000) / 150000);
      }
      return calcVICFull(value);
    }
    case "QLD": {
      if (buyerType === "first-home-buyer" && value <= 500000) return 0;
      return calcQLDFull(value);
    }
    case "WA": {
      if (buyerType === "first-home-buyer" && value <= 430000) return 0;
      if (buyerType === "first-home-buyer" && value <= 530000) {
        return calcWAFull(value) * ((value - 430000) / 100000);
      }
      return calcWAFull(value);
    }
    case "SA": return calcSAFull(value);
    case "TAS": return calcTASFull(value);
    case "ACT": {
      if (buyerType === "first-home-buyer" && value <= 1000000) return 0;
      return calcACTFull(value);
    }
    case "NT": return calcNTFull(value);
    default: return 0;
  }
}

function calcNSWFull(v: number): number {
  if (v <= 16000) return v * 0.0125;
  if (v <= 35000) return 200 + (v - 16000) * 0.015;
  if (v <= 93000) return 485 + (v - 35000) * 0.0175;
  if (v <= 351000) return 1500 + (v - 93000) * 0.035;
  if (v <= 1168000) return 10530 + (v - 351000) * 0.045;
  if (v <= 3505000) return 47295 + (v - 1168000) * 0.055;
  return 175560 + (v - 3505000) * 0.07;
}

function calcVICFull(v: number): number {
  if (v <= 25000) return v * 0.014;
  if (v <= 130000) return 350 + (v - 25000) * 0.024;
  if (v <= 960000) return 2870 + (v - 130000) * 0.06;
  if (v <= 2000000) return 52670 + (v - 960000) * 0.055;
  return 109870 + (v - 2000000) * 0.065;
}

function calcQLDFull(v: number): number {
  if (v <= 5000) return 0;
  if (v <= 75000) return (v - 5000) * 0.015;
  if (v <= 540000) return 1050 + (v - 75000) * 0.035;
  if (v <= 1000000) return 17325 + (v - 540000) * 0.045;
  return 38025 + (v - 1000000) * 0.0575;
}

function calcWAFull(v: number): number {
  if (v <= 120000) return v * 0.019;
  if (v <= 150000) return 2280 + (v - 120000) * 0.0285;
  if (v <= 360000) return 3135 + (v - 150000) * 0.038;
  if (v <= 725000) return 11115 + (v - 360000) * 0.0475;
  return 28453 + (v - 725000) * 0.051;
}

function calcSAFull(v: number): number {
  if (v <= 12000) return v * 0.01;
  if (v <= 30000) return 120 + (v - 12000) * 0.02;
  if (v <= 50000) return 480 + (v - 30000) * 0.03;
  if (v <= 100000) return 1080 + (v - 50000) * 0.035;
  if (v <= 200000) return 2830 + (v - 100000) * 0.04;
  if (v <= 250000) return 6830 + (v - 200000) * 0.0425;
  if (v <= 300000) return 8955 + (v - 250000) * 0.0475;
  if (v <= 500000) return 11330 + (v - 300000) * 0.05;
  return 21330 + (v - 500000) * 0.055;
}

function calcTASFull(v: number): number {
  if (v <= 3000) return 50;
  if (v <= 25000) return 50 + (v - 3000) * 0.0175;
  if (v <= 75000) return 435 + (v - 25000) * 0.025;
  if (v <= 200000) return 1685 + (v - 75000) * 0.03;
  if (v <= 375000) return 5435 + (v - 200000) * 0.035;
  if (v <= 725000) return 11560 + (v - 375000) * 0.04;
  return 25560 + (v - 725000) * 0.045;
}

function calcACTFull(v: number): number {
  if (v <= 200000) return v * 0.006;
  if (v <= 300000) return 1200 + (v - 200000) * 0.023;
  if (v <= 500000) return 3500 + (v - 300000) * 0.049;
  if (v <= 750000) return 13300 + (v - 500000) * 0.064;
  if (v <= 1000000) return 29300 + (v - 750000) * 0.067;
  if (v <= 1455000) return 46050 + (v - 1000000) * 0.069;
  return 77445 + (v - 1455000) * 0.049;
}

function calcNTFull(v: number): number {
  const D = v / 1000;
  if (v <= 525000) return (0.06571441 * D * D + 15 * D) * D / 1000;
  return v * 0.0495;
}

const STATE_NAMES: Record<State, string> = {
  NSW: "New South Wales", VIC: "Victoria", QLD: "Queensland",
  WA: "Western Australia", SA: "South Australia", TAS: "Tasmania",
  ACT: "Australian Capital Territory", NT: "Northern Territory",
};

const REVENUE_URLS: Record<State, string> = {
  NSW: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty",
  VIC: "https://www.sro.vic.gov.au/land-transfer-duty",
  QLD: "https://www.qld.gov.au/housing/buying-owning-home/advice-buying-home/transfer-duty",
  WA: "https://www.wa.gov.au/service/financial-management/taxation/transfer-duty-calculator",
  SA: "https://www.revenuesa.sa.gov.au/taxes-and-duties/stamp-duties/real-property",
  TAS: "https://www.sro.tas.gov.au/duties/",
  ACT: "https://www.revenue.act.gov.au/duties/conveyance-duty",
  NT: "https://nt.gov.au/property/buying-or-selling-a-property/stamp-duty",
};

export default function StampDuty() {
  const [state, setState] = useState<State>("NSW");
  const [propertyPrice, setPropertyPrice] = useState("750000");
  const [buyerType, setBuyerType] = useState<BuyerType>("owner-occupier");

  const result = useMemo(() => {
    const value = parseFloat(propertyPrice.replace(/,/g, "")) || 0;
    if (!value) return null;
    const duty = calcStampDuty(state, value, buyerType);
    const totalCost = value + duty;
    const effectiveRate = value > 0 ? (duty / value) * 100 : 0;
    return { duty, totalCost, effectiveRate, value };
  }, [state, propertyPrice, buyerType]);

  const handleLoad = useCallback((inputData: Record<string, unknown>) => {
    if (inputData.state) setState(inputData.state as State);
    if (inputData.propertyPrice) setPropertyPrice(String(inputData.propertyPrice));
    if (inputData.buyerType) setBuyerType(inputData.buyerType as BuyerType);
  }, []);

  const inputData = { state, propertyPrice, buyerType };
  const resultData = result ? { duty: result.duty, totalCost: result.totalCost } : {};

  return (
    <CalculatorLayout
      title="Stamp Duty Calculator"
      description="Calculate stamp duty and government fees for all Australian states and territories."
      icon="📋"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Property Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State / Territory</label>
              <select value={state} onChange={(e) => setState(e.target.value as State)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {(Object.keys(STATE_NAMES) as State[]).map((s) => (
                  <option key={s} value={s}>{s} — {STATE_NAMES[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Value</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" min={0} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Type</label>
              <select value={buyerType} onChange={(e) => setBuyerType(e.target.value as BuyerType)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="first-home-buyer">First Home Buyer</option>
                <option value="owner-occupier">Owner-Occupier</option>
                <option value="investor">Investor</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <SaveLoadButtons calculatorType="stamp-duty" inputData={inputData} resultData={resultData} onLoad={handleLoad} />
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#1e3a5f] text-white rounded-2xl p-5 shadow-sm">
                <p className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-1">Stamp Duty</p>
                <p className="text-3xl font-bold">{fmtAUD(result.duty)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Total Purchase Cost</p>
                <p className="text-2xl font-bold text-gray-900">{fmtAUD(result.totalCost)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Effective Rate</p>
                <p className="text-2xl font-bold text-gray-900">{result.effectiveRate.toFixed(2)}%</p>
              </div>
            </div>

            {result.duty === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                🎉 <strong>No stamp duty payable!</strong> You qualify for a full exemption as a first home buyer in {STATE_NAMES[state]}.
              </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">Official {STATE_NAMES[state]} Revenue Office</p>
              <a href={REVENUE_URLS[state]} target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all">
                {REVENUE_URLS[state]}
              </a>
              <p className="mt-2 text-xs text-blue-600">
                Always verify with the official revenue office. Rates and concessions change regularly.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Educational Content ── */}
      <div className="mt-10 space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">Understanding Stamp Duty in Australia</h2>
          <p>
            Stamp duty — formally known as transfer duty in most states — is a state and territory government tax levied on the purchase of property. It is one of the largest upfront costs of buying a home and must be paid in addition to your deposit, legal fees, and building inspection costs. Because stamp duty is calculated as a percentage of the purchase price (with higher rates applying to higher price brackets), it can represent a significant sum: on a $750,000 property in New South Wales, for example, the duty payable by an owner-occupier is approximately $29,055. The exact amount varies considerably between states and territories, and different rates apply depending on whether you are a first home buyer, an owner-occupier, or an investor.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">First Home Buyer Concessions by State</h3>
          <p className="mb-3">
            Every Australian state and territory offers some form of stamp duty relief for eligible first home buyers, though the thresholds, exemption amounts, and eligibility criteria differ significantly.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1e3a5f] text-white">
                  <th className="text-left px-3 py-2 rounded-tl-lg">State / Territory</th>
                  <th className="text-left px-3 py-2 rounded-tr-lg">First Home Buyer Concession Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-white"><td className="px-3 py-2 font-medium">NSW</td><td className="px-3 py-2">Full exemption for new homes up to $800,000; concessions up to $1,000,000. First home buyers can also opt into an annual property tax instead of upfront stamp duty.</td></tr>
                <tr className="bg-gray-50"><td className="px-3 py-2 font-medium">VIC</td><td className="px-3 py-2">Full exemption for properties up to $600,000; concessions on a sliding scale up to $750,000.</td></tr>
                <tr className="bg-white"><td className="px-3 py-2 font-medium">QLD</td><td className="px-3 py-2">Full exemption for homes up to $500,000; concessions up to $550,000. Applies to owner-occupied purchases only.</td></tr>
                <tr className="bg-gray-50"><td className="px-3 py-2 font-medium">WA</td><td className="px-3 py-2">Full exemption for properties up to $430,000; concessions up to $530,000.</td></tr>
                <tr className="bg-white"><td className="px-3 py-2 font-medium">SA</td><td className="px-3 py-2">No dedicated first home buyer stamp duty concession; however, the First Home Owner Grant may apply for new builds.</td></tr>
                <tr className="bg-gray-50"><td className="px-3 py-2 font-medium">TAS</td><td className="px-3 py-2">50% concession on stamp duty for established homes up to $600,000.</td></tr>
                <tr className="bg-white"><td className="px-3 py-2 font-medium">ACT</td><td className="px-3 py-2">Full exemption for eligible buyers under the Home Buyer Concession Scheme, subject to income and property value caps.</td></tr>
                <tr className="bg-gray-50"><td className="px-3 py-2 font-medium">NT</td><td className="px-3 py-2">Full exemption on the first $650,000 for eligible first home buyers under the Territory Home Owner Discount.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">Thresholds and eligibility criteria change regularly. Always confirm current rates with your state’s revenue office before exchanging contracts.</p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">When Is Stamp Duty Due?</h3>
          <p>
            Stamp duty is typically due within 30 days of settlement in most states, though in some states it must be paid before or at settlement. In New South Wales, duty must be paid within three months of the contract date (or 14 days for off-the-plan purchases). In Victoria, duty is due within 30 days of settlement. In Queensland, it must be paid within 30 days of settlement. Because stamp duty is a large lump sum, it is critical to factor it into your savings plan well before you exchange contracts. Failing to pay on time can attract significant penalties and interest charges from the relevant state revenue authority.
          </p>
        </section>

        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-3">Worked Example</h3>
          <p>
            <strong>Scenario:</strong> Michael is purchasing an established home in Melbourne, Victoria for $680,000 as an owner-occupier. He is not a first home buyer.
          </p>
          <p className="mt-2">
            Victoria’s general transfer duty applies. The duty on a $680,000 property is calculated in brackets: $0–$25,000 at 1.4%, $25,001–$130,000 at 2.4%, $130,001–$960,000 at 6%. The total stamp duty payable is approximately <strong>$36,830</strong>. Had Michael been a first home buyer purchasing a property under $600,000, he would have paid <strong>$0</strong> in stamp duty — a saving of over $31,000 on a $599,000 purchase.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-3">Key Terms</h3>
          <dl className="space-y-3">
            <div>
              <dt className="font-semibold text-gray-900">Transfer Duty</dt>
              <dd className="text-gray-600 mt-0.5">The official name for stamp duty in most Australian states. It is a tax on the transfer of property ownership from seller to buyer.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Dutiable Value</dt>
              <dd className="text-gray-600 mt-0.5">The value on which duty is calculated — generally the higher of the purchase price or the property’s market value.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">First Home Owner Grant (FHOG)</dt>
              <dd className="text-gray-600 mt-0.5">A separate one-off government grant (distinct from stamp duty concessions) available to eligible first home buyers purchasing or building a new home. The amount varies by state.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Foreign Purchaser Surcharge</dt>
              <dd className="text-gray-600 mt-0.5">An additional stamp duty surcharge applied to foreign nationals purchasing residential property in Australia. Rates vary by state and can be as high as 8% of the purchase price.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Off-the-Plan Purchase</dt>
              <dd className="text-gray-600 mt-0.5">Buying a property before it is built. Stamp duty concessions often apply because duty is calculated on the contract price less the construction cost component.</dd>
            </div>
          </dl>
        </section>

        <p className="text-xs text-gray-400">
          Stamp duty rates and concessions change regularly. This content is for general information only. Always verify current rates with the relevant state or territory revenue office before making any property purchase decisions.
        </p>
      </div>
    </CalculatorLayout>
  );
}
