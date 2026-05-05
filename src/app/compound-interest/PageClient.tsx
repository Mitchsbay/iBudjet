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

      {/* ── Educational Content ── */}
      <div className="mt-10 space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">The Power of Compound Interest</h2>
          <p>
            Compound interest is often described as the most powerful force in personal finance. Unlike simple interest, which is calculated only on the original principal, compound interest is calculated on both the principal and the accumulated interest from prior periods. This means your investment grows exponentially rather than linearly — the longer you invest, the more dramatic the effect becomes. Albert Einstein is frequently (if apocryphally) credited with calling compound interest the &quot;eighth wonder of the world,&quot; and while the attribution may be apocryphal, the sentiment captures how transformative long-term compounding can be for Australian investors.
          </p>
          <p className="mt-3">
            The key variables that determine how quickly your money compounds are the interest rate, the compounding frequency, the length of time you invest, and the regularity of your contributions. Of these, time is arguably the most important: starting to invest even a few years earlier can result in dramatically higher final balances, because the early years of compounding lay the foundation for all subsequent growth.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">The Rule of 72</h3>
          <p>
            The Rule of 72 is a simple mental shortcut for estimating how long it will take for an investment to double at a given annual interest rate. Divide 72 by the annual interest rate, and the result is the approximate number of years required to double your money. For example, at a 7% annual return, your investment will double in approximately 72 ÷ 7 = <strong>10.3 years</strong>. At 9%, it doubles in approximately 8 years. At 4%, it takes about 18 years. The Rule of 72 is a useful tool for quickly comparing investment options and understanding the long-term impact of different rates of return.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">Compounding Frequency and Its Effect</h3>
          <p>
            The more frequently interest is compounded, the faster your investment grows — though the difference between monthly and daily compounding is relatively small compared to the difference between annual and monthly compounding. For most Australian savings accounts and term deposits, interest is compounded monthly or quarterly. Superannuation funds and ETFs effectively compound continuously as investment returns are reinvested. The table below illustrates how compounding frequency affects the growth of a $10,000 investment at 7% p.a. over 20 years:
          </p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1e3a5f] text-white">
                  <th className="text-left px-3 py-2 rounded-tl-lg">Compounding Frequency</th>
                  <th className="text-right px-3 py-2 rounded-tr-lg">Future Value (20 years, 7% p.a.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-white"><td className="px-3 py-2">Annually</td><td className="text-right px-3 py-2">$38,697</td></tr>
                <tr className="bg-gray-50"><td className="px-3 py-2">Quarterly</td><td className="text-right px-3 py-2">$39,796</td></tr>
                <tr className="bg-white"><td className="px-3 py-2">Monthly</td><td className="text-right px-3 py-2">$40,064</td></tr>
                <tr className="bg-gray-50"><td className="px-3 py-2">Weekly</td><td className="text-right px-3 py-2">$40,133</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">Compound Interest in the Australian Context</h3>
          <p>
            For Australians, the most significant application of compound interest is superannuation. The compulsory superannuation system requires employers to contribute a percentage of an employee’s ordinary time earnings into a super fund, and these contributions — along with any voluntary contributions — compound over a working lifetime of 40 or more years. The difference between a high-fee fund and a low-fee fund can amount to hundreds of thousands of dollars at retirement, precisely because fees compound in the same way as returns. A 1% annual fee difference on a $200,000 balance over 20 years at 7% p.a. can cost more than $80,000 in lost returns.
          </p>
          <p className="mt-3">
            Outside of superannuation, Australian investors commonly use exchange-traded funds (ETFs) to access diversified, low-cost investment portfolios. When dividends are reinvested (either automatically through a dividend reinvestment plan or manually), the compounding effect is amplified. High-growth ETFs tracking the ASX 200 or global indices have historically delivered long-term returns in the range of 7–10% per annum before inflation.
          </p>
        </section>

        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-3">Worked Example</h3>
          <p className="mb-3">
            <strong>Scenario:</strong> James is 30 years old and invests $15,000 as an initial lump sum, then contributes $500 per month into a diversified ETF portfolio earning an average of 8% p.a., compounded monthly. He plans to retire at 65 (35 years of investing).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1e3a5f] text-white">
                  <th className="text-left px-3 py-2 rounded-tl-lg">Metric</th>
                  <th className="text-right px-3 py-2 rounded-tr-lg">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-white"><td className="px-3 py-2">Initial investment</td><td className="text-right px-3 py-2">$15,000</td></tr>
                <tr className="bg-gray-50"><td className="px-3 py-2">Monthly contribution</td><td className="text-right px-3 py-2">$500</td></tr>
                <tr className="bg-white"><td className="px-3 py-2">Total contributions over 35 years</td><td className="text-right px-3 py-2">$225,000</td></tr>
                <tr className="bg-gray-50"><td className="px-3 py-2">Total amount invested (incl. initial)</td><td className="text-right px-3 py-2">$240,000</td></tr>
                <tr className="bg-white font-semibold text-[#1e3a5f]"><td className="px-3 py-2">Projected future value at 8% p.a.</td><td className="text-right px-3 py-2">~$1,095,000</td></tr>
                <tr className="bg-green-50 text-green-700 font-semibold"><td className="px-3 py-2">Interest earned (compounding)</td><td className="text-right px-3 py-2">~$855,000</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm">
            James invests $240,000 of his own money over 35 years but ends up with approximately $1,095,000 — meaning compound interest contributes more than <strong>3.5 times</strong> his total contributions. This illustrates why starting early and staying invested is the most powerful wealth-building strategy available to ordinary Australians.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-3">Key Terms</h3>
          <dl className="space-y-3">
            <div>
              <dt className="font-semibold text-gray-900">Compound Interest</dt>
              <dd className="text-gray-600 mt-0.5">Interest calculated on both the initial principal and the accumulated interest from previous periods. Results in exponential rather than linear growth.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Principal</dt>
              <dd className="text-gray-600 mt-0.5">The original sum of money invested or deposited, before any interest is added.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Compounding Frequency</dt>
              <dd className="text-gray-600 mt-0.5">How often interest is calculated and added to the principal. Common frequencies are annually, quarterly, monthly, and weekly. More frequent compounding produces slightly higher returns.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Rule of 72</dt>
              <dd className="text-gray-600 mt-0.5">A quick mental calculation to estimate how many years it takes for an investment to double: divide 72 by the annual interest rate. For example, at 8% p.a., an investment doubles in approximately 9 years.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Real Return</dt>
              <dd className="text-gray-600 mt-0.5">The investment return after adjusting for inflation. If your investment earns 8% p.a. and inflation is 3%, your real return is approximately 5%. Real return reflects the actual increase in purchasing power.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Superannuation (Super)</dt>
              <dd className="text-gray-600 mt-0.5">Australia’s compulsory retirement savings system. Employer and voluntary contributions compound inside a tax-advantaged environment over a working lifetime, making it one of the most powerful compounding vehicles available to Australians.</dd>
            </div>
          </dl>
        </section>

        <p className="text-xs text-gray-400">
          This content is for general information only and does not constitute financial advice. Investment returns are not guaranteed and past performance is not indicative of future results. Always consult a licensed financial adviser before making investment decisions.
        </p>
      </div>
    </CalculatorLayout>
  );
}
