"use client";


import { useState, useMemo, useCallback } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SaveLoadButtons from "@/components/SaveLoadButtons";
import { fmtAUD, monthsToYearsMonths } from "@/lib/utils";

type Freq = "monthly" | "fortnightly" | "weekly";

interface AmortRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function calcMortgage(loanAmount: number, annualRate: number, termYears: number) {
  if (!loanAmount || !annualRate || !termYears) return null;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  const monthly = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalMonthly = monthly * n;
  const interestMonthly = totalMonthly - loanAmount;

  // True accelerated: fortnightly = monthly/2 paid 26x/yr; weekly = monthly/4 paid 52x/yr
  const fortnightly = monthly / 2;
  const weekly = monthly / 4;

  // Simulate fortnightly payoff
  let balFn = loanAmount;
  let periodsFn = 0;
  let interestFn = 0;
  const dailyRate = annualRate / 100 / 365;
  while (balFn > 0.01 && periodsFn < 10000) {
    const intCharge = balFn * dailyRate * 14;
    interestFn += intCharge;
    balFn = balFn + intCharge - fortnightly;
    if (balFn < 0) balFn = 0;
    periodsFn++;
  }
  const monthsFn = (periodsFn * 14) / 30.4375;

  // Simulate weekly payoff
  let balWk = loanAmount;
  let periodsWk = 0;
  let interestWk = 0;
  while (balWk > 0.01 && periodsWk < 50000) {
    const intCharge = balWk * dailyRate * 7;
    interestWk += intCharge;
    balWk = balWk + intCharge - weekly;
    if (balWk < 0) balWk = 0;
    periodsWk++;
  }
  const monthsWk = (periodsWk * 7) / 30.4375;

  // Amortisation schedule (monthly)
  const schedule: AmortRow[] = [];
  let balance = loanAmount;
  for (let i = 1; i <= n && balance > 0.01; i++) {
    const interest = balance * r;
    const principal = Math.min(monthly - interest, balance);
    balance = Math.max(0, balance - principal);
    schedule.push({ period: i, payment: principal + interest, principal, interest, balance });
  }

  return {
    monthly,
    fortnightly,
    weekly,
    totalMonthly,
    interestMonthly,
    totalFn: interestFn + loanAmount,
    interestFn,
    monthsFn,
    totalWk: interestWk + loanAmount,
    interestWk,
    monthsWk,
    schedule,
    termMonths: n,
  };
}

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState("500000");
  const [annualRate, setAnnualRate] = useState("6.5");
  const [termYears, setTermYears] = useState("30");
  const [freq, setFreq] = useState<Freq>("monthly");
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const result = useMemo(
    () =>
      calcMortgage(
        parseFloat(loanAmount.replace(/,/g, "")) || 0,
        parseFloat(annualRate) || 0,
        parseInt(termYears) || 0
      ),
    [loanAmount, annualRate, termYears]
  );

  const handleLoad = useCallback((inputData: Record<string, unknown>) => {
    if (inputData.loanAmount) setLoanAmount(String(inputData.loanAmount));
    if (inputData.annualRate) setAnnualRate(String(inputData.annualRate));
    if (inputData.termYears) setTermYears(String(inputData.termYears));
    if (inputData.freq) setFreq(inputData.freq as Freq);
  }, []);

  const inputData = { loanAmount, annualRate, termYears, freq };
  const resultData = result
    ? { monthly: result.monthly, totalInterest: result.interestMonthly }
    : {};

  const freqData = result
    ? {
        monthly: { payment: result.monthly, total: result.totalMonthly, interest: result.interestMonthly, months: result.termMonths },
        fortnightly: { payment: result.fortnightly, total: result.totalFn, interest: result.interestFn, months: result.monthsFn },
        weekly: { payment: result.weekly, total: result.totalWk, interest: result.interestWk, months: result.monthsWk },
      }
    : null;

  const current = freqData?.[freq];
  const savings = freqData && freq !== "monthly"
    ? {
        interestSaved: freqData.monthly.interest - freqData[freq].interest,
        monthsSaved: freqData.monthly.months - freqData[freq].months,
      }
    : null;

  const displaySchedule = showFullSchedule
    ? result?.schedule ?? []
    : result?.schedule.slice(0, 24) ?? [];

  return (
    <CalculatorLayout
      title="Mortgage Repayment Calculator"
      description="Calculate your mortgage repayments and see how accelerated fortnightly or weekly payments save you time and interest."
      icon="🏠"
      showAsicDisclaimer
    >
      <div className="space-y-6">
        {/* Inputs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Loan Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={0}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (% p.a.)</label>
              <div className="relative">
                <input
                  type="number"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  step={0.1}
                  className="w-full pr-7 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={0}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (years)</label>
              <input
                type="number"
                value={termYears}
                onChange={(e) => setTermYears(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={1}
                max={30}
              />
            </div>
          </div>

          {/* Frequency tabs */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Repayment Frequency</label>
            <div className="flex gap-2">
              {(["monthly", "fortnightly", "weekly"] as Freq[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFreq(f)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    freq === f
                      ? "bg-[#1e3a5f] text-white shadow"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <SaveLoadButtons
              calculatorType="mortgage"
              inputData={inputData}
              resultData={resultData}
              onLoad={handleLoad}
            />
          </div>
        </div>

        {/* Results */}
        {result && current && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#1e3a5f] text-white rounded-2xl p-5 shadow-sm">
                <p className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-1 capitalize">{freq} Repayment</p>
                <p className="text-3xl font-bold">{fmtAUD(current.payment)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Total Repayments</p>
                <p className="text-2xl font-bold text-gray-900">{fmtAUD(current.total)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-red-600">{fmtAUD(current.interest)}</p>
              </div>
            </div>

            {/* Savings callout */}
            {savings && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <p className="text-green-800 font-semibold mb-1">
                  🎉 Accelerated {freq} repayments save you:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <div>
                    <p className="text-2xl font-bold text-green-700">{fmtAUD(savings.interestSaved)}</p>
                    <p className="text-sm text-green-600">in interest</p>
                  </div>
                  <div className="hidden sm:block w-px bg-green-200" />
                  <div>
                    <p className="text-2xl font-bold text-green-700">{monthsToYearsMonths(savings.monthsSaved)}</p>
                    <p className="text-sm text-green-600">off your loan term</p>
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-3">
                  Compared to monthly repayments over {termYears} years.
                </p>
              </div>
            )}

            {/* Amortisation schedule */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Amortisation Schedule (Monthly)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Month</th>
                      <th className="text-right px-4 py-3 text-gray-500 font-medium">Payment</th>
                      <th className="text-right px-4 py-3 text-gray-500 font-medium">Principal</th>
                      <th className="text-right px-4 py-3 text-gray-500 font-medium">Interest</th>
                      <th className="text-right px-4 py-3 text-gray-500 font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {displaySchedule.map((row) => (
                      <tr key={row.period} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2.5 text-gray-600">{row.period}</td>
                        <td className="px-4 py-2.5 text-right font-medium">{fmtAUD(row.payment, 2)}</td>
                        <td className="px-4 py-2.5 text-right text-blue-600">{fmtAUD(row.principal, 2)}</td>
                        <td className="px-4 py-2.5 text-right text-red-500">{fmtAUD(row.interest, 2)}</td>
                        <td className="px-4 py-2.5 text-right text-gray-700">{fmtAUD(row.balance, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {(result.schedule.length > 24) && (
                <div className="px-6 py-4 border-t border-gray-100 text-center">
                  <button
                    onClick={() => setShowFullSchedule(!showFullSchedule)}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    {showFullSchedule
                      ? "Show less"
                      : `Show all ${result.schedule.length} months`}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </CalculatorLayout>
  );
}
