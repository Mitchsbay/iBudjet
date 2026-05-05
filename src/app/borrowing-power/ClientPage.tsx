"use client";


import { useState, useMemo, useCallback } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SaveLoadButtons from "@/components/SaveLoadButtons";
import { fmtAUD } from "@/lib/utils";

function calcBorrowingPower(
  annualIncome: number,
  monthlyExpenses: number,
  dependants: number,
  interestRate: number,
  loanTermYears: number
) {
  if (!annualIncome || !interestRate || !loanTermYears) return null;
  const serviceRate = interestRate + 3; // APRA 3% buffer
  const r = serviceRate / 100 / 12;
  const n = loanTermYears * 12;
  const dependantCost = dependants * 500;
  const totalExpenses = monthlyExpenses + dependantCost;
  const monthlyIncome = annualIncome / 12;
  const netMonthly = monthlyIncome * 0.8 - totalExpenses; // ~80% net
  if (netMonthly <= 0) return { maxBorrow: 0, monthlyRepayment: 0, serviceRate };
  const factor = (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
  const maxBorrow = Math.max(0, netMonthly * factor);
  const actualR = interestRate / 100 / 12;
  const monthlyRepayment =
    maxBorrow > 0
      ? (maxBorrow * actualR * Math.pow(1 + actualR, n)) / (Math.pow(1 + actualR, n) - 1)
      : 0;
  return { maxBorrow, monthlyRepayment, serviceRate };
}

export default function BorrowingPower() {
  const [annualIncome, setAnnualIncome] = useState("120000");
  const [monthlyExpenses, setMonthlyExpenses] = useState("3000");
  const [dependants, setDependants] = useState("0");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");

  const result = useMemo(
    () =>
      calcBorrowingPower(
        parseFloat(annualIncome.replace(/,/g, "")) || 0,
        parseFloat(monthlyExpenses.replace(/,/g, "")) || 0,
        parseInt(dependants) || 0,
        parseFloat(interestRate) || 0,
        parseInt(loanTerm) || 0
      ),
    [annualIncome, monthlyExpenses, dependants, interestRate, loanTerm]
  );

  const handleLoad = useCallback((inputData: Record<string, unknown>) => {
    if (inputData.annualIncome) setAnnualIncome(String(inputData.annualIncome));
    if (inputData.monthlyExpenses) setMonthlyExpenses(String(inputData.monthlyExpenses));
    if (inputData.dependants) setDependants(String(inputData.dependants));
    if (inputData.interestRate) setInterestRate(String(inputData.interestRate));
    if (inputData.loanTerm) setLoanTerm(String(inputData.loanTerm));
  }, []);

  const inputData = { annualIncome, monthlyExpenses, dependants, interestRate, loanTerm };
  const resultData = result ? { maxBorrow: result.maxBorrow } : {};

  return (
    <CalculatorLayout
      title="Borrowing Power Calculator"
      description="Estimate how much you can borrow based on your income, expenses, and dependants. Uses the APRA 3% serviceability buffer."
      icon="📊"
      showAsicDisclaimer
    >
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Your Financial Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income (before tax)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Living Expenses</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Dependants</label>
              <input type="number" value={dependants} onChange={(e) => setDependants(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" min={0} max={10} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (% p.a.)</label>
              <div className="relative">
                <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} step={0.1}
                  className="w-full pr-7 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (years)</label>
              <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" min={1} max={30} />
            </div>
          </div>
          <div className="mt-4">
            <SaveLoadButtons calculatorType="borrowing-power" inputData={inputData} resultData={resultData} onLoad={handleLoad} />
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="bg-[#1e3a5f] text-white rounded-2xl p-6 shadow-sm">
              <p className="text-blue-200 text-sm font-medium mb-1">Estimated Borrowing Power</p>
              <p className="text-4xl font-extrabold">{fmtAUD(result.maxBorrow)}</p>
              <p className="text-blue-300 text-sm mt-2">
                Assessed at {result.serviceRate.toFixed(1)}% (your rate + 3% APRA buffer)
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Est. Monthly Repayment</p>
                <p className="text-2xl font-bold text-gray-900">{fmtAUD(result.monthlyRepayment)}</p>
                <p className="text-xs text-gray-400 mt-1">At your actual rate of {interestRate}%</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Serviceability Buffer</p>
                <p className="text-2xl font-bold text-gray-900">+3.00%</p>
                <p className="text-xs text-gray-400 mt-1">APRA regulatory requirement</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
              <strong>Note:</strong> This is an estimate only. Actual borrowing capacity depends on your lender&apos;s
              credit assessment, existing debts, credit history, and other factors. Speak to a mortgage broker
              or lender for a formal assessment.
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
