export type Guide = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  subheadings: { title: string; body: string }[];
  calculatorLinks: { href: string; label: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "first-home-buyer-guide-all-costs-explained-australia-2026",
    title: "First Home Buyer Guide: All Costs Explained (Australia 2026)",
    description:
      "A plain-English guide to the main upfront and ongoing costs Australian first home buyers should plan for before making an offer.",
    intro:
      "Buying your first home is exciting, but the deposit is only one part of the budget. In Australia, first home buyers also need to think about stamp duty, lender costs, legal fees, inspections, moving costs, and the repayments that start after settlement.",
    subheadings: [
      {
        title: "Start with your real buying budget",
        body:
          "Before you focus on listings, estimate your borrowing range and monthly repayments. A property that looks affordable on paper can feel very different once interest rates, loan term, living costs, and fees are included.",
      },
      {
        title: "Do not ignore stamp duty and settlement costs",
        body:
          "Stamp duty can be one of the largest upfront costs for buyers, although concessions may apply depending on your state or territory and your circumstances. Add these costs early so you are not surprised close to settlement.",
      },
      {
        title: "Compare the numbers before you commit",
        body:
          "Use the calculators together to test different purchase prices, deposits, and repayment amounts. This gives you a clearer view of the gap between what a bank may lend and what you can comfortably manage.",
      },
    ],
    calculatorLinks: [
      { href: "/stamp-duty", label: "Stamp duty calculator" },
      { href: "/borrowing-power", label: "Borrowing power calculator" },
      { href: "/mortgage-calculator", label: "Mortgage calculator" },
    ],
  },
  {
    slug: "how-much-mortgage-can-you-really-afford",
    title: "How Much Mortgage Can You Really Afford? Breaking the Bank's Rules",
    description:
      "Learn why your approved loan amount is not always the same as your comfortable loan amount, especially when life costs change.",
    intro:
      "A lender's borrowing estimate is useful, but it is not the same as a household comfort test. Banks apply serviceability rules, buffers, and assumptions, while you still have to manage groceries, insurance, transport, childcare, repairs, and the unexpected.",
    subheadings: [
      {
        title: "Approval is not the same as comfort",
        body:
          "The amount a bank may approve can sit near the top of your limit. A more practical approach is to compare repayments against your real spending habits and leave room for rate changes or income interruptions.",
      },
      {
        title: "Stress test your repayments",
        body:
          "Try higher interest rates, shorter loan terms, and different deposit sizes. This helps you see whether the loan still works if your repayments increase or if your regular expenses rise.",
      },
      {
        title: "Small extra repayments can change the loan",
        body:
          "Even modest extra repayments can reduce interest over time. Once you know the baseline repayment, test what happens if you add a little more each week, fortnight, or month.",
      },
    ],
    calculatorLinks: [
      { href: "/mortgage-calculator", label: "Mortgage calculator" },
      { href: "/borrowing-power", label: "Borrowing power calculator" },
      { href: "/extra-repayments", label: "Extra repayments calculator" },
    ],
  },
  {
    slug: "stamp-duty-by-state-nsw-vic-qld-wa-sa-tas-act-nt-compared",
    title: "Stamp Duty By State: NSW, VIC, QLD, WA, SA, TAS, ACT, NT Compared",
    description:
      "A quick overview of why stamp duty changes depending on where you buy and why state-by-state comparison matters.",
    intro:
      "Stamp duty is not the same across Australia. The amount can change based on the state or territory, property value, buyer type, occupancy, and whether a concession or exemption applies.",
    subheadings: [
      {
        title: "Each state uses its own rules",
        body:
          "NSW, VIC, QLD, WA, SA, TAS, ACT, and NT all calculate transfer duty differently. This is why a property with the same purchase price can have a different upfront cost depending on where it is located.",
      },
      {
        title: "First home buyer concessions can make a large difference",
        body:
          "Many buyers focus on the headline purchase price and forget to check whether they qualify for a concession. Eligibility can depend on value thresholds, residency requirements, occupancy rules, and previous ownership history.",
      },
      {
        title: "Compare before you make an offer",
        body:
          "Running the numbers early helps you understand the full cash required at settlement. This is especially important when comparing suburbs across borders or considering investment purchases.",
      },
    ],
    calculatorLinks: [
      { href: "/stamp-duty?state=NSW", label: "NSW stamp duty" },
      { href: "/stamp-duty?state=VIC", label: "VIC stamp duty" },
      { href: "/stamp-duty?state=QLD", label: "QLD stamp duty" },
      { href: "/stamp-duty?state=WA", label: "WA stamp duty" },
      { href: "/stamp-duty", label: "All states stamp duty calculator" },
    ],
  },
  {
    slug: "compound-interest-explained-why-100-a-month-makes-you-a-millionaire",
    title: "Compound Interest Explained: Why $100 a Month Makes You a Millionaire",
    description:
      "A simple guide to how regular investing, time, and compounding can turn small monthly contributions into meaningful long-term wealth.",
    intro:
      "Compound interest is powerful because your returns can start earning returns of their own. The earlier you begin, the more time your money has to grow, even if the monthly contribution looks small at the start.",
    subheadings: [
      {
        title: "Time matters more than most people think",
        body:
          "The first few years can feel slow because the balance is still small. Over longer periods, compounding can become more noticeable as both your contributions and previous returns keep working together.",
      },
      {
        title: "$100 a month is a habit, not a magic number",
        body:
          "The point is consistency. A regular monthly amount can build the discipline of investing while giving compounding more time to do its work. Higher contributions, longer timeframes, and stronger returns can change the result dramatically.",
      },
      {
        title: "Use projections carefully",
        body:
          "A calculator can show the maths, but real investment returns are not guaranteed and can move around from year to year. Use projections as a planning tool, not a promise.",
      },
    ],
    calculatorLinks: [
      { href: "/compound-interest", label: "Compound interest calculator" },
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug);
}
