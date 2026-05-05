export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for iBudget.au, covering permitted use, calculator estimates, intellectual property, prohibited conduct and Australian law.",
};

const sections = [
  {
    heading: "1. About these terms",
    paragraphs: [
      "These Terms of Use apply to your use of iBudget.au, including the calculators, saved calculation features, resources, articles and any future contact or account features.",
      "By using this website, you agree to these terms. If you do not agree, you should stop using the website.",
    ],
  },
  {
    heading: "2. Informational use only",
    paragraphs: [
      "iBudget provides general calculators and educational content for Australian users. The calculators are intended to help you explore estimates and scenarios. They are not a substitute for professional financial, legal, tax, lending or accounting advice.",
      "You are responsible for checking any figures, assumptions and results before relying on them. You should seek independent professional advice before making a financial decision, applying for finance, buying property, refinancing, investing or making taxation decisions.",
    ],
  },
  {
    heading: "3. No financial advice or credit assistance",
    paragraphs: [
      "iBudget does not hold an Australian Financial Services Licence or Australian Credit Licence. Nothing on this website is intended to be personal financial advice, credit advice, taxation advice, legal advice, a product recommendation or an offer to provide a financial product.",
      "Calculator outputs are general estimates based on the information and assumptions entered by the user. They do not take into account your objectives, financial situation, needs, credit history, lender policy, taxes, fees or personal circumstances.",
    ],
  },
  {
    heading: "4. Accuracy of calculators and content",
    paragraphs: [
      "iBudget aims to provide useful calculators and resources, but the website may contain errors, omissions, outdated information or simplified assumptions. Results may differ from figures produced by lenders, brokers, state revenue offices, accountants, financial advisers or other professionals.",
      "Stamp duty, borrowing power, repayments, GST, compound interest and extra repayment calculations can change depending on rules, thresholds, rates, fees, concessions and individual circumstances. You should verify important information with the relevant official source or adviser.",
    ],
  },
  {
    heading: "5. Saved calculations and share links",
    paragraphs: [
      "The website may let you save or share calculations. Saved calculations are provided for convenience only and are designed to expire after 30 days.",
      "A person with access to a share link may be able to view the saved calculation. Do not save or share information that you consider confidential, sensitive or unnecessarily identifying.",
    ],
  },
  {
    heading: "6. Permitted use",
    paragraphs: [
      "You may use iBudget for lawful, personal, educational or ordinary business research purposes. You must use the website in a way that does not interfere with its operation or misuse its systems.",
    ],
    bullets: [
      "use the calculators for general scenario testing and planning;",
      "read and share public articles by linking to them;",
      "save calculations for your own convenience where the feature is available; and",
      "contact iBudget through any contact method provided on the site.",
    ],
  },
  {
    heading: "7. Prohibited conduct",
    paragraphs: [
      "You must not misuse iBudget or attempt to interfere with the website, its database, hosting, analytics, advertising or security systems. Prohibited conduct includes:",
    ],
    bullets: [
      "scraping, harvesting, copying or bulk extracting website data without permission;",
      "using bots, automated requests, vulnerability scanning or excessive traffic that may affect site availability;",
      "attempting to access admin areas, CMS functions, databases, storage buckets or authentication systems without authorisation;",
      "uploading malicious code, spam, unlawful material or misleading content;",
      "reverse engineering, bypassing security controls or interfering with ads; and",
      "using the website in a way that breaches Australian law or infringes another person’s rights.",
    ],
  },
  {
    heading: "8. Admin accounts and future user accounts",
    paragraphs: [
      "iBudget currently uses admin login for CMS management only and does not provide public user accounts. If registration is added later, users will be responsible for keeping login details secure and for activity that occurs through their account.",
      "iBudget may suspend or remove access to any account or feature where misuse, security risk or breach of these terms is suspected.",
    ],
  },
  {
    heading: "9. Intellectual property",
    paragraphs: [
      "Unless otherwise stated, iBudget owns or licenses the website design, calculators, code, branding, text, article structure, layouts and other content on the site. These materials are protected by intellectual property laws.",
      "You may link to public iBudget pages. You must not copy, reproduce, republish, sell, frame, scrape or commercially exploit substantial parts of the website without written permission, except where permitted by law.",
    ],
  },
  {
    heading: "10. Third-party services and links",
    paragraphs: [
      "iBudget uses third-party services such as Vercel, Supabase and Google AdSense. These services may operate under their own terms and privacy practices.",
      "The website may include links to third-party websites in the future, including government pages, tools, resources or advertiser links. iBudget is not responsible for the content, accuracy, security or practices of third-party websites.",
    ],
  },
  {
    heading: "11. Advertising",
    paragraphs: [
      "iBudget may display advertising through Google AdSense or other advertising partners. Advertising does not mean iBudget endorses the advertised product or service. You should make your own assessment before dealing with any advertiser.",
    ],
  },
  {
    heading: "12. Limitation of liability",
    paragraphs: [
      "To the maximum extent permitted by law, iBudget is not liable for loss, damage, cost or expense arising from your use of, or reliance on, the website, calculators, saved calculations, articles, ads or third-party links.",
      "This includes loss arising from inaccurate calculations, outdated information, incorrect user inputs, interruptions, data loss, share link access, technical errors or decisions made based on website content.",
      "Nothing in these terms excludes, restricts or modifies any consumer guarantee, right or remedy that cannot be excluded under the Australian Consumer Law or any other applicable law. Where liability cannot be excluded, it is limited to the extent permitted by law.",
    ],
  },
  {
    heading: "13. Availability and changes to the website",
    paragraphs: [
      "iBudget may change, suspend or discontinue any part of the website at any time, including calculators, articles, saved calculation features, admin tools and advertising placements.",
      "The website may occasionally be unavailable due to maintenance, hosting issues, updates, security events or third-party service interruptions.",
    ],
  },
  {
    heading: "14. Changes to these terms",
    paragraphs: [
      "iBudget may update these Terms of Use from time to time. The updated version will be published on this page. Continued use of the website after the terms are updated means you accept the updated terms.",
    ],
  },
  {
    heading: "15. Governing law",
    paragraphs: [
      "These terms are governed by the laws of New South Wales, Australia, and applicable Commonwealth laws of Australia. You submit to the non-exclusive jurisdiction of the courts of New South Wales and Australia.",
    ],
  },
  {
    heading: "16. Contact",
    paragraphs: [
      "For questions about these terms, contact: support@ibudget.au.",
    ],
  },
];

export default function TermsOfUsePage() {
  return (
    <LegalPage
      title="Terms of Use"
      description="These terms explain how you may use iBudget.au and the limits that apply to calculators, resources, saved calculations, advertising and site content."
      sections={sections}
    />
  );
}
