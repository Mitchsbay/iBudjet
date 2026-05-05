type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalPageProps = {
  title: string;
  description: string;
  effectiveDate?: string;
  sections: LegalSection[];
};

export default function LegalPage({
  title,
  description,
  effectiveDate,
  sections,
}: LegalPageProps) {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
      <article className="mx-auto max-w-4xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="border-b border-gray-100 pb-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
            iBudget legal information
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-[#1e3a5f] sm:text-4xl">
            {title}
          </h1>
          {effectiveDate ? (
            <p className="mt-3 text-sm font-medium text-gray-600">
              Effective Date: {effectiveDate}
            </p>
          ) : null}
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            {description}
          </p>
        </div>

        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-[#1e3a5f]">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-relaxed text-gray-700">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed text-gray-700">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
