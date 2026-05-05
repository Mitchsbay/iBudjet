export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Disclaimer for iBudget.au explaining that calculators and articles provide estimates and general information only, not financial advice.",
};

const sections = [
  {
    heading: "1. General information only",
    paragraphs: [
      "iBudget.au provides financial calculators and educational resources for general information only. The website is designed to help Australian users explore common financial scenarios, but it does not provide personal financial advice, credit advice, legal advice, tax advice or accounting advice.",
      "You should not rely on iBudget as the only basis for making a financial decision. You should seek independent professional advice that takes into account your own objectives, financial situation and needs.",
    ],
  },
  {
    heading: "2. Calculators provide estimates only",
    paragraphs: [
      "All calculator results are estimates. Results depend on the figures, assumptions and settings entered by the user. Small changes to inputs such as interest rate, fees, loan term, repayment frequency, property price, state or territory, concessions and inflation assumptions can significantly change the result.",
      "Calculator outputs may not match actual lender assessments, product terms, repayments, fees, tax treatment, government charges or official calculations.",
    ],
  },
  {
    heading: "3. No licensed financial service",
    paragraphs: [
      "iBudget does not hold an Australian Financial Services Licence or Australian Credit Licence. The website does not recommend any particular financial product, credit product, lender, investment, property purchase, repayment strategy or tax structure.",
      "Any examples, articles or calculator outputs are general in nature and do not consider your personal circumstances.",
    ],
  },
  {
    heading: "4. Mortgage, borrowing power and repayment calculators",
    paragraphs: [
      "Mortgage repayment, borrowing power and extra repayment calculators use simplified assumptions. Real lender assessments may include serviceability buffers, credit history, living expenses, dependants, employment type, existing liabilities, product fees, package fees, interest rate changes, lender policy and other factors.",
      "A calculator result does not mean a lender will approve a loan, offer a particular rate or accept the assumptions used.",
    ],
  },
  {
    heading: "5. Stamp duty and government charges",
    paragraphs: [
      "Stamp duty and property-related government charge estimates may not reflect every exemption, concession, surcharge, threshold, residency rule, foreign purchaser rule or state and territory update.",
      "Before buying property or relying on a stamp duty figure, verify the amount with the relevant state or territory revenue office, conveyancer, solicitor, broker or other qualified professional.",
    ],
  },
  {
    heading: "6. GST and tax-related calculators",
    paragraphs: [
      "GST calculator results are general estimates only. Tax rules can be complex and depend on your business structure, registration status, transaction type, record keeping, invoice treatment and advice from your accountant or tax adviser.",
      "You should confirm GST, tax and accounting treatment with a qualified accountant, registered tax agent or the Australian Taxation Office before acting on the result.",
    ],
  },
  {
    heading: "7. Compound interest and investment assumptions",
    paragraphs: [
      "Compound interest calculations are projections based on assumed contribution amounts, rates of return, time periods and compounding settings. Actual investment returns may be higher or lower and can be negative.",
      "The calculator does not account for all fees, taxes, inflation, investment risk, market volatility or product-specific terms unless those inputs are expressly included.",
    ],
  },
  {
    heading: "8. Accuracy and currency of information",
    paragraphs: [
      "iBudget aims to keep calculators and resources useful, but information may be incomplete, inaccurate or out of date. Financial rules, tax settings, interest rates, lender policies, government fees and concessions can change.",
      "You should verify important figures with official sources and professional advisers before making decisions.",
    ],
  },
  {
    heading: "9. No liability for reliance",
    paragraphs: [
      "To the maximum extent permitted by law, iBudget is not liable for any loss, damage, cost or expense arising from reliance on calculator outputs, article content, saved calculations, assumptions, examples, advertisements or third-party links.",
      "This includes decisions about borrowing, repayments, property purchases, refinancing, investing, saving, tax, budgeting or business planning. Nothing in this disclaimer limits rights that cannot be excluded under Australian law.",
    ],
  },
  {
    heading: "10. Professional advice recommended",
    paragraphs: [
      "Before making a significant financial decision, consider speaking with a suitably qualified professional, such as a licensed financial adviser, mortgage broker, accountant, registered tax agent, solicitor or conveyancer, depending on the issue.",
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      description="This disclaimer applies to all iBudget calculators, resources, saved calculations and general information. The site provides estimates and education only, not professional advice."
      sections={sections}
    />
  );
}
