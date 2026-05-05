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
            <div className="flex flex-wrap gap-2">
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
                <table className="w-full text-sm min-w-[480px]">
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

      {/* ── Educational Content ── */}
      <div className="mt-10 space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">

        {/* Intro */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">Understanding Your Mortgage Repayments</h2>
          <p>
            A mortgage is likely the largest financial commitment you will ever make, so understanding how your repayments are calculated is essential. In Australia, most home loans are structured as principal and interest (P&amp;I) loans repaid over 25 or 30 years, with interest calculated daily on the outstanding balance. The repayment amount stays constant throughout the loan term, but the proportion going toward interest versus principal shifts over time — in the early years the majority of each repayment covers interest, while in the later years it rapidly reduces the principal.
          </p>
        </section>

        {/* LVR */}
        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">How LVR Affects Your Interest Rate</h3>
          <p>
            The Loan-to-Value Ratio (LVR) is the size of your loan expressed as a percentage of the property's value. Australian lenders use LVR as a primary risk indicator. Borrowers with an LVR above 80% are typically required to pay Lenders Mortgage Insurance (LMI), which can add tens of thousands of dollars to the cost of a loan. More importantly, lenders generally offer their sharpest interest rates to borrowers with an LVR of 70% or below, because a larger deposit provides a greater buffer against falling property values. Reducing your LVR — either by saving a larger deposit or by making extra repayments over time — is one of the most effective ways to lower your interest rate and reduce the total cost of your loan.
          </p>
        </section>

        {/* P&I vs IO */}
        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">Principal &amp; Interest vs Interest-Only</h3>
          <p>
            A principal and interest (P&amp;I) loan requires you to repay both the amount borrowed and the interest charged each period. Your balance reduces with every repayment, and you build equity in the property from day one. An interest-only (IO) loan requires you to pay only the interest for a set period — typically one to five years — after which the loan reverts to P&amp;I repayments. IO loans are common among property investors because they maximise cash flow and the interest is generally tax-deductible against rental income. However, IO repayments are not building equity, and when the IO period ends, the remaining principal must be repaid over a shorter term, which can significantly increase repayments. APRA has placed restrictions on IO lending, and most lenders charge a higher interest rate for IO loans compared to equivalent P&amp;I products.
          </p>
        </section>

        {/* What lenders look for */}
        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">What Australian Lenders Look For</h3>
          <p>
            Australian lenders assess home loan applications across several dimensions. Your credit score — held by agencies such as Equifax, Experian, and illion — reflects your history of repaying debts on time and is one of the first things a lender checks. Your income must be stable and verifiable: PAYG employees typically need two recent payslips and a tax return, while self-employed borrowers generally need two years of tax returns and financial statements. Lenders also scrutinise your living expenses, existing debts (credit cards, car loans, HECS/HELP), and the number of financial dependants. Since 2019, APRA requires all lenders to assess your ability to repay at the loan's interest rate plus a 3% serviceability buffer, ensuring you could still meet repayments if rates were to rise.
          </p>
        </section>

        {/* Example */}
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-3">Worked Example</h3>
          <p className="mb-3">
            <strong>Scenario:</strong> Sarah and James are buying their first home in Brisbane for $750,000. They have saved a $150,000 deposit (20% LVR), avoiding LMI entirely. They borrow $600,000 at a variable rate of 6.20% p.a. over 30 years.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1e3a5f] text-white">
                  <th className="text-left px-3 py-2 rounded-tl-lg">Repayment Type</th>
                  <th className="text-right px-3 py-2">Amount</th>
                  <th className="text-right px-3 py-2 rounded-tr-lg">Total Interest Paid</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b border-blue-100">
                  <td className="px-3 py-2">Monthly</td>
                  <td className="text-right px-3 py-2">$3,659</td>
                  <td className="text-right px-3 py-2">$717,240</td>
                </tr>
                <tr className="bg-blue-50 border-b border-blue-100">
                  <td className="px-3 py-2">Fortnightly (accelerated)</td>
                  <td className="text-right px-3 py-2">$1,830</td>
                  <td className="text-right px-3 py-2">$598,400</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-3 py-2">Weekly (accelerated)</td>
                  <td className="text-right px-3 py-2">$915</td>
                  <td className="text-right px-3 py-2">$581,200</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">By switching to accelerated fortnightly repayments, Sarah and James would save approximately $118,840 in interest and pay off their loan around 4.5 years earlier.</p>
        </section>

        {/* Key Terms */}
        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-3">Key Terms</h3>
          <dl className="space-y-3">
            <div>
              <dt className="font-semibold text-gray-900">Principal</dt>
              <dd className="text-gray-600 mt-0.5">The original amount borrowed, excluding interest. Each P&amp;I repayment reduces the outstanding principal.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">LVR (Loan-to-Value Ratio)</dt>
              <dd className="text-gray-600 mt-0.5">Your loan amount divided by the property's value, expressed as a percentage. An LVR above 80% usually triggers LMI.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">LMI (Lenders Mortgage Insurance)</dt>
              <dd className="text-gray-600 mt-0.5">Insurance that protects the lender (not you) if you default. Payable when your LVR exceeds 80%.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Comparison Rate</dt>
              <dd className="text-gray-600 mt-0.5">A rate that combines the interest rate and most fees into a single figure, making it easier to compare loans. Required by law to be disclosed in Australian advertising.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Offset Account</dt>
              <dd className="text-gray-600 mt-0.5">A transaction account linked to your mortgage. The balance in the offset account reduces the principal on which interest is calculated each day.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Redraw Facility</dt>
              <dd className="text-gray-600 mt-0.5">Allows you to withdraw extra repayments you have made above the minimum required. Not all loans include this feature.</dd>
            </div>
          </dl>
        </section>

        <p className="text-xs text-gray-400">
          This content is for general information only and does not constitute financial advice. Always consult a licensed mortgage broker or financial adviser before making borrowing decisions.
        </p>
      </div>
    </CalculatorLayout>
  );
}
