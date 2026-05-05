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

      {/* ── Educational Content ── */}
      <div className="mt-10 space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-3">How Australian Banks Calculate Your Borrowing Power</h2>
          <p>
            Borrowing power — also called borrowing capacity or serviceability — is the maximum amount a lender is willing to lend you based on your financial circumstances. Australian lenders are required by the National Consumer Credit Protection Act to conduct a responsible lending assessment before approving any home loan. This means they must verify that the loan is not unsuitable for you and that you can genuinely afford the repayments without suffering substantial financial hardship. The assessment considers your gross income, all living expenses, existing debt obligations, and the number of financial dependants in your household.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">The 3% Serviceability Buffer</h3>
          <p>
            Since October 2021, APRA (the Australian Prudential Regulation Authority) has required all authorised deposit-taking institutions — including the major banks, regional banks, and credit unions — to assess a borrower’s ability to repay at the loan’s interest rate plus a minimum buffer of 3 percentage points. This means that if you are applying for a loan at 6.00% p.a., the lender must confirm you can afford repayments at 9.00% p.a. The buffer exists to protect borrowers from payment shock if interest rates rise after settlement. It is one of the primary reasons why the amount a lender will approve is often significantly lower than the amount you might calculate using the advertised interest rate alone. Some lenders apply a buffer higher than 3%, particularly for borrowers with complex income structures or high existing debt levels.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">How HEM Affects Your Borrowing Capacity</h3>
          <p>
            The Household Expenditure Measure (HEM) is a benchmark developed by the Melbourne Institute that estimates the minimum non-discretionary living expenses for Australian households at different income levels and family sizes. Australian lenders use HEM as a floor when assessing your living expenses: if the expenses you declare on your application are lower than the HEM benchmark for your household type, the lender will substitute the HEM figure instead. This practice became widespread following the 2018 Royal Commission into Misconduct in the Banking, Superannuation and Financial Services Industry, which found that many lenders had been using unrealistically low expense estimates. In practical terms, HEM means that even if you live very frugally, the lender will assume a minimum level of expenditure when calculating how much you can borrow. Borrowers with higher declared expenses than HEM will have their actual expenses used, which reduces their borrowing capacity further.
          </p>
        </section>

        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-3">Worked Example</h3>
          <p className="mb-3">
            <strong>Scenario:</strong> Emma earns $110,000 gross per year as a PAYG employee in Sydney. She has no existing debts, no dependants, and declares $3,200/month in living expenses. She is applying for a loan at a variable rate of 6.20% p.a. over 30 years.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1e3a5f] text-white">
                  <th className="text-left px-3 py-2 rounded-tl-lg">Assessment Factor</th>
                  <th className="text-right px-3 py-2 rounded-tr-lg">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-white"><td className="px-3 py-2">Gross annual income</td><td className="text-right px-3 py-2">$110,000</td></tr>
                <tr className="bg-gray-50"><td className="px-3 py-2">Net monthly income (approx. after tax)</td><td className="text-right px-3 py-2">~$6,850</td></tr>
                <tr className="bg-white"><td className="px-3 py-2">Declared monthly expenses</td><td className="text-right px-3 py-2">$3,200</td></tr>
                <tr className="bg-gray-50"><td className="px-3 py-2">Assessment rate (6.20% + 3% buffer)</td><td className="text-right px-3 py-2">9.20% p.a.</td></tr>
                <tr className="bg-white font-semibold"><td className="px-3 py-2">Estimated borrowing power</td><td className="text-right px-3 py-2">~$560,000</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">If Emma had a $500/month car loan, her estimated borrowing power would reduce to approximately $490,000 — demonstrating how existing debts significantly erode borrowing capacity.</p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-[#1e3a5f] mb-3">Key Terms</h3>
          <dl className="space-y-3">
            <div>
              <dt className="font-semibold text-gray-900">Serviceability</dt>
              <dd className="text-gray-600 mt-0.5">A lender’s assessment of your ability to meet loan repayments without financial hardship, both now and if interest rates were to increase.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">APRA Serviceability Buffer</dt>
              <dd className="text-gray-600 mt-0.5">The mandatory 3% interest rate buffer that all APRA-regulated lenders must add to the loan rate when assessing whether a borrower can afford repayments.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">HEM (Household Expenditure Measure)</dt>
              <dd className="text-gray-600 mt-0.5">A benchmark of minimum household living expenses used by lenders. If your declared expenses are below HEM, the lender will use HEM instead.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Debt-to-Income Ratio (DTI)</dt>
              <dd className="text-gray-600 mt-0.5">Your total debt divided by your gross annual income. APRA has flagged concern about borrowers with a DTI above 6x, and many lenders apply additional scrutiny above this threshold.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">HECS/HELP Debt</dt>
              <dd className="text-gray-600 mt-0.5">Australian student loan debt that is repaid through the tax system. Lenders include HECS/HELP repayment obligations when calculating your net income and borrowing capacity.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Responsible Lending Obligations</dt>
              <dd className="text-gray-600 mt-0.5">Legal requirements under the National Consumer Credit Protection Act that require lenders to verify a loan is not unsuitable for the borrower before approving it.</dd>
            </div>
          </dl>
        </section>

        <p className="text-xs text-gray-400">
          This content is for general information only and does not constitute financial advice. Borrowing capacity estimates vary significantly between lenders. Always consult a licensed mortgage broker or financial adviser before making borrowing decisions.
        </p>
      </div>
    </CalculatorLayout>
  );
}
