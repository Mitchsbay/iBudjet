"use client";


import { useState, useMemo, useCallback } from "react";
import nextDynamic from "next/dynamic";
import CalculatorLayout from "@/components/CalculatorLayout";
import SaveLoadButtons from "@/components/SaveLoadButtons";
import { fmtAUD } from "@/lib/utils";

const CompoundInterestChart = nextDynamic(
  () => import("@/components/charts/CompoundInterestChart"),
  { ssr: false, loading: () => <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">Loading chart…</div> }
);

type Frequency = "annually" | "semi-annually" | "quarterly" | "monthly" | "weekly";

const FREQ_MAP: Record<Frequency, number> = {
  annually: 1,
  "semi-annually": 2,
  quarterly: 4,
  monthly: 12,
  weekly: 52,
};

function calcCompound(
  principal: number,
  monthlyContribution: number,
  years: number,
  annualRate: number,
  frequency: Frequency
) {
  if (!principal || !annualRate || !years) return null;
  const n = FREQ_MAP[frequency];
  const r = annualRate / 100 / n;
  const totalPeriods = n * years;
  const contribPerPeriod = monthlyContribution * (12 / n);

  const chartData: { year: number; principal: number; contributions: number; interest: number; total: number }[] = [];
  let balance = principal;
  let totalContrib = 0;

  for (let period = 1; period <= totalPeriods; period++) {
    balance = balance * (1 + r) + contribPerPeriod;
    totalContrib += contribPerPeriod;
    if (period % n === 0 || period === totalPeriods) {
      const year = Math.ceil(period / n);
      const totalInvested = principal + totalContrib;
      chartData.push({
        year,
        principal,
        contributions: Math.round(totalContrib),
        interest: Math.round(balance - totalInvested),
        total: Math.round(balance),
      });
    }
  }

  const finalValue = balance;
  const totalInvested = principal + totalContrib;
  const totalInterest = finalValue - totalInvested;

  return { finalValue, totalInvested, totalInterest, chartData };
}

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState("10000");
  const [monthlyContribution, setMonthlyContribution] = useState("500");
  const [years, setYears] = useState("20");
  const [annualRate, setAnnualRate] = useState("7");
  const [frequency, setFrequency] = useState<Frequency>("monthly");

  const result = useMemo(
    () =>
      calcCompound(
        parseFloat(principal.replace(/,/g, "")) || 0,
        parseFloat(monthlyContribution.replace(/,/g, "")) || 0,
        parseInt(years) || 0,
        parseFloat(annualRate) || 0,
        frequency
      ),
    [principal, monthlyContribution, years, annualRate, frequency]
  );

  const handleLoad = useCallback((inputData: Record<string, unknown>) => {
    if (inputData.principal) setPrincipal(String(inputData.principal));
    if (inputData.monthlyContribution) setMonthlyContribution(String(inputData.monthlyContribution));
    if (inputData.years) setYears(String(inputData.years));
    if (inputData.annualRate) setAnnualRate(String(inputData.annualRate));
    if (inputData.frequency) setFrequency(inputData.frequency as Frequency);
  }, []);

  const inputData = { principal, monthlyContribution, years, annualRate, frequency };
  const resultData = result ? { finalValue: result.finalValue, totalInterest: result.totalInterest } : {};

  return (
    <CalculatorLayout
      title="Compound Interest Calculator"
      description="Project the future value of your investment with principal, regular contributions, interest rate, and compounding frequency."
      icon="📈"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Investment Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Investment</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" min={0} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" min={0} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investment Period (years)</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" min={1} max={50} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Interest Rate</label>
              <div className="relative">
                <input type="number" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} step={0.1}
                  className="w-full pr-7 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" min={0} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Compounding Frequency</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(FREQ_MAP) as Frequency[]).map((f) => (
                  <button key={f} onClick={() => setFrequency(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                      frequency === f ? "bg-[#1e3a5f] text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <SaveLoadButtons calculatorType="compound-interest" inputData={inputData} resultData={resultData} onLoad={handleLoad} />
          </div>
        </div>

        {result && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#1e3a5f] text-white rounded-2xl p-5 shadow-sm">
                <p className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-1">Future Value</p>
                <p className="text-3xl font-bold">{fmtAUD(result.finalValue)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Total Invested</p>
                <p className="text-2xl font-bold text-gray-900">{fmtAUD(result.totalInvested)}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <p className="text-green-600 text-xs font-medium uppercase tracking-wide mb-1">Interest Earned</p>
                <p className="text-2xl font-bold text-green-700">{fmtAUD(result.totalInterest)}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Investment Growth Over Time</h3>
              <CompoundInterestChart data={result.chartData} />
            </div>
          </>
        )}
      </div>
    </CalculatorLayout>
  );
}
