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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Base Repayment</p>
                <p className="text-base sm:text-xl font-bold text-gray-900">{fmtAUD(result.basePayment)}/mo</p>
              </div>
              <div className="bg-[#1e3a5f] text-white rounded-2xl p-5 shadow-sm">
                <p className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-1">New Repayment</p>
                <p className="text-base sm:text-xl font-bold">{fmtAUD(result.newPayment)}/mo</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <p className="text-green-600 text-xs font-medium uppercase tracking-wide mb-1">Interest Saved</p>
                <p className="text-base sm:text-xl font-bold text-green-700">{fmtAUD(result.interestSaved)}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <p className="text-green-600 text-xs font-medium uppercase tracking-wide mb-1">Time Saved</p>
                <p className="text-base sm:text-xl font-bold text-green-700">{monthsToYearsMonths(result.monthsSaved)}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Total Cost Comparison</h3>
              <ExtraRepaymentsChart data={chartData} />
            </div>
          </>
        )}
      </div>

      {/* ── Educational Content ── */}
      <div className="mt-10 space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">How Extra Repayments Save You Money</h2>
          <p>
            Making extra repayments on your home loan is one of the most effective strategies available to Australian borrowers for reducing the total cost of their mortgage. Because home loan interest is calculated on the outstanding principal balance, any additional amount you pay above the minimum required repayment directly reduces the principal. This means that every dollar of extra repayment reduces the interest charged in all subsequent periods, creating a compounding benefit over the life of the loan. Even modest additional payments made consistently can shave years off a 30-year mortgage and save tens of thousands of dollars in interest.
          </p>
          <p className="mt-3">
            Most Australian variable rate home loans allow unlimited extra repayments without penalty. Fixed rate loans, however, typically cap extra repayments at $10,000 per year during the fixed period, with break costs applying if you exceed this limit or refinance early. Always check your loan contract before making large lump-sum payments on a fixed rate loan.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">Extra Repayments vs. Offset Account</h3>
          <p>
            Both extra repayments and offset accounts reduce the interest charged on your home loan, but they work differently and suit different borrowers. An <strong>offset account</strong> is a transaction account linked to your mortgage where the balance is offset against your loan principal when interest is calculated. For example, if you have a $500,000 loan and $50,000 in your offset account, you only pay interest on $450,000. The key advantage of an offset account is that your money remains accessible at any time — you can withdraw it for emergencies, renovations, or investment purposes without affecting your loan.
          </p>
          <p className="mt-3">
            <strong>Extra repayments</strong> permanently reduce your loan balance. Once paid, the money is no longer accessible unless your loan has a redraw facility. For borrowers who are disciplined savers and do not anticipate needing access to their extra funds, direct extra repayments can be marginally more effective because the principal reduction is immediate and permanent. For borrowers who value liquidity, an offset account offers the same interest-saving benefit with the flexibility to access funds when needed.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">Understanding the Redraw Facility</h3>
          <p>
            A redraw facility allows you to access the extra repayments you have made above the minimum required amount. If you have paid $20,000 ahead on your mortgage, a redraw facility lets you withdraw some or all of that amount if you need it. Most Australian lenders offer redraw facilities on variable rate loans, though some charge a fee per redraw transaction or impose a minimum redraw amount. Unlike an offset account, funds in redraw are considered part of the loan and may not be as readily accessible — some lenders require several business days to process a redraw request. It is important to understand your lender&apos;s specific redraw terms before relying on this feature as an emergency fund.
          </p>
        </section>

        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-3">Worked Example</h3>
          <p className="mb-3">
            <strong>Scenario:</strong> Sarah has a $500,000 home loan at 6.00% p.a. over 30 years. Her minimum monthly repayment is $2,998. She decides to pay an extra $500 per month.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1e3a5f] text-white">
                  <th className="text-left px-3 py-2 rounded-tl-lg">Scenario</th>
                  <th className="text-right px-3 py-2">Loan Term</th>
                  <th className="text-right px-3 py-2 rounded-tr-lg">Total Interest Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-white"><td className="px-3 py-2">Minimum repayments only</td><td className="text-right px-3 py-2">30 years</td><td className="text-right px-3 py-2">$579,190</td></tr>
                <tr className="bg-gray-50 font-semibold text-green-700"><td className="px-3 py-2">+ $500/month extra</td><td className="text-right px-3 py-2">~24 years 1 month</td><td className="text-right px-3 py-2">~$436,450</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm">
            By paying just $500 extra per month, Sarah saves approximately <strong>$142,740 in interest</strong> and pays off her loan almost <strong>6 years early</strong>. The total extra outlay over the shortened loan term is around $144,500 in extra payments — but the interest saving makes this one of the highest-return, risk-free financial decisions available to Australian homeowners.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-3">Key Terms</h3>
          <dl className="space-y-3">
            <div>
              <dt className="font-semibold text-gray-900">Extra Repayment</dt>
              <dd className="text-gray-600 mt-0.5">Any payment made above the minimum required monthly (or fortnightly/weekly) repayment. Extra repayments directly reduce the outstanding principal balance.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Offset Account</dt>
              <dd className="text-gray-600 mt-0.5">A transaction account linked to your home loan. The account balance is offset against your loan principal when interest is calculated, reducing the interest charged without permanently reducing the loan balance.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Redraw Facility</dt>
              <dd className="text-gray-600 mt-0.5">A loan feature that allows you to withdraw extra repayments you have previously made above the minimum required amount. Availability and conditions vary by lender.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Loan Term Reduction</dt>
              <dd className="text-gray-600 mt-0.5">The number of years and months by which your loan will be paid off earlier as a result of making extra repayments. This directly correlates with the amount of interest saved.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Break Cost (Fixed Rate)</dt>
              <dd className="text-gray-600 mt-0.5">A fee charged by lenders when a fixed rate loan is paid off early or extra repayments exceed the annual cap. Break costs can be substantial and should be checked before making large lump-sum payments.</dd>
            </div>
          </dl>
        </section>

        <p className="text-xs text-gray-400">
          This content is for general information only and does not constitute financial advice. Always read your loan contract and speak with your lender or a licensed mortgage broker before making changes to your repayment strategy.
        </p>
      </div>
    </CalculatorLayout>
  );
}
