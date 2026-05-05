"use client";


import { useState, useMemo, useCallback } from "react";
import nextDynamic from "next/dynamic";
import CalculatorLayout from "@/components/CalculatorLayout";
import SaveLoadButtons from "@/components/SaveLoadButtons";
import { fmtAUD, monthsToYearsMonths } from "@/lib/utils";

const ExtraRepaymentsChart = nextDynamic(
  () => import("@/components/charts/ExtraRepaymentsChart"),
  { ssr: false, loading: () => <div className="h-[280px] flex items-center justify-center text-gray-400 text-sm">Loading chart…</div> }
);

function calcExtra(
  loanAmount: number,
  rate: number,
  termYears: number,
  extraMonthly: number
) {
  if (!loanAmount || !rate || !termYears) return null;
  const r = rate / 100 / 12;
  const n = termYears * 12;
  const basePayment = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  let bal = loanAmount;
  let totalInterestBase = 0;
  let periodsBase = 0;
  while (bal > 0.01 && periodsBase < n) {
    const interest = bal * r;
    totalInterestBase += interest;
    bal = bal + interest - basePayment;
    if (bal < 0) bal = 0;
    periodsBase++;
  }

  const newPayment = basePayment + extraMonthly;
  bal = loanAmount;
  let totalInterestExtra = 0;
  let periodsExtra = 0;
  while (bal > 0.01 && periodsExtra < n) {
    const interest = bal * r;
    totalInterestExtra += interest;
    bal = bal + interest - newPayment;
    if (bal < 0) bal = 0;
    periodsExtra++;
  }

  return {
    basePayment,
    newPayment,
    totalInterestBase,
    totalInterestExtra,
    interestSaved: totalInterestBase - totalInterestExtra,
    monthsSaved: periodsBase - periodsExtra,
    periodsBase,
    periodsExtra,
  };
}

export default function ExtraRepayments() {
  const [loanAmount, setLoanAmount] = useState("500000");
  const [rate, setRate] = useState("6.5");
  const [termYears, setTermYears] = useState("30");
  const [extraMonthly, setExtraMonthly] = useState("500");

  const result = useMemo(
    () =>
      calcExtra(
        parseFloat(loanAmount.replace(/,/g, "")) || 0,
        parseFloat(rate) || 0,
        parseInt(termYears) || 0,
        parseFloat(extraMonthly.replace(/,/g, "")) || 0
      ),
    [loanAmount, rate, termYears, extraMonthly]
  );

  const handleLoad = useCallback((inputData: Record<string, unknown>) => {
    if (inputData.loanAmount) setLoanAmount(String(inputData.loanAmount));
    if (inputData.rate) setRate(String(inputData.rate));
    if (inputData.termYears) setTermYears(String(inputData.termYears));
    if (inputData.extraMonthly) setExtraMonthly(String(inputData.extraMonthly));
  }, []);

  const inputData = { loanAmount, rate, termYears, extraMonthly };
  const resultData = result
    ? { interestSaved: result.interestSaved, monthsSaved: result.monthsSaved }
    : {};

  const chartData = result
    ? [
        {
          name: "Without Extra",
          "Total Interest": Math.round(result.totalInterestBase),
          "Loan Principal": parseFloat(loanAmount.replace(/,/g, "")) || 0,
        },
        {
          name: "With Extra",
          "Total Interest": Math.round(result.totalInterestExtra),
          "Loan Principal": parseFloat(loanAmount.replace(/,/g, "")) || 0,
        },
      ]
    : [];

  return (
    <CalculatorLayout
      title="Extra Repayments Calculator"
      description="See how much time and interest you save by making additional repayments on your mortgage."
      icon="💰"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Loan Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (% p.a.)</label>
              <div className="relative">
                <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} step={0.1}
                  className="w-full pr-7 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (years)</label>
              <input type="number" value={termYears} onChange={(e) => setTermYears(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" min={1} max={30} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Extra Monthly Repayment</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input type="number" value={extraMonthly} onChange={(e) => setExtraMonthly(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" min={0} />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <SaveLoadButtons calculatorType="extra-repayments" inputData={inputData} resultData={resultData} onLoad={handleLoad} />
          </div>
        </div>

        {result && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Base Repayment</p>
                <p className="text-xl font-bold text-gray-900">{fmtAUD(result.basePayment)}/mo</p>
              </div>
              <div className="bg-[#1e3a5f] text-white rounded-2xl p-5 shadow-sm">
                <p className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-1">New Repayment</p>
                <p className="text-xl font-bold">{fmtAUD(result.newPayment)}/mo</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <p className="text-green-600 text-xs font-medium uppercase tracking-wide mb-1">Interest Saved</p>
                <p className="text-xl font-bold text-green-700">{fmtAUD(result.interestSaved)}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <p className="text-green-600 text-xs font-medium uppercase tracking-wide mb-1">Time Saved</p>
                <p className="text-xl font-bold text-green-700">{monthsToYearsMonths(result.monthsSaved)}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Total Cost Comparison</h3>
              <ExtraRepaymentsChart data={chartData} />
            </div>
          </>
        )}
      </div>
    </CalculatorLayout>
  );
}
