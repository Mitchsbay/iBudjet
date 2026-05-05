-- iBudget simple articles CMS setup
-- Run this in Supabase SQL Editor after deploying the code.

create extension if not exists pgcrypto;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  featured_image_url text,
  meta_title text,
  meta_description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  related_calculators text[] not null default '{}',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.articles
  add column if not exists related_calculators text[] not null default '{}';

create index if not exists articles_status_published_at_idx
  on public.articles (status, published_at desc);

alter table public.articles enable row level security;

-- Public visitors can only read published articles.
drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles"
  on public.articles
  for select
  using (status = 'published');

-- Simple admin policy: any authenticated user can manage articles.
-- For this site, keep Google sign-in private to your own account.
-- If you later want stricter admin-only email checks, add an admin_users table.
drop policy if exists "Authenticated users can manage articles" on public.articles;
create policy "Authenticated users can manage articles"
  on public.articles
  for all
  to authenticated
  using (true)
  with check (true);

-- Featured image bucket. Public read, authenticated upload.
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view article images" on storage.objects;
create policy "Public can view article images"
  on storage.objects
  for select
  using (bucket_id = 'article-images');

drop policy if exists "Authenticated users can upload article images" on storage.objects;
create policy "Authenticated users can upload article images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'article-images');

drop policy if exists "Authenticated users can update article images" on storage.objects;
create policy "Authenticated users can update article images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'article-images')
  with check (bucket_id = 'article-images');

drop policy if exists "Authenticated users can delete article images" on storage.objects;
create policy "Authenticated users can delete article images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'article-images');

-- Optional seed articles. These replace the old hard-coded placeholder guides.
insert into public.articles (
  title, slug, excerpt, content, meta_title, meta_description, status, related_calculators, published_at
)
values
(
  'First Home Buyer Guide: All Costs Explained (Australia 2026)',
  'first-home-buyer-guide-all-costs-explained-australia-2026',
  'A plain-English guide to the main upfront and ongoing costs Australian first home buyers should plan for before making an offer.',
  '# First Home Buyer Guide: All Costs Explained (Australia 2026)

Buying your first home is exciting, but the deposit is only one part of the budget. In Australia, first home buyers also need to think about stamp duty, lender costs, legal fees, inspections, moving costs, and the repayments that start after settlement.

## Start with your real buying budget

Before you focus on listings, estimate your borrowing range and monthly repayments. A property that looks affordable on paper can feel very different once interest rates, loan term, living costs, and fees are included.

Use the [borrowing power calculator](/borrowing-power) and [mortgage calculator](/mortgage-calculator) to test a few realistic scenarios.

## Do not ignore stamp duty and settlement costs

Stamp duty can be one of the largest upfront costs for buyers, although concessions may apply depending on your state or territory and your circumstances.

Use the [stamp duty calculator](/stamp-duty) to estimate this before you make an offer.

## Compare the numbers before you commit

Use the calculators together to test different purchase prices, deposits, and repayment amounts. This gives you a clearer view of the gap between what a bank may lend and what you can comfortably manage.',
  'First Home Buyer Guide Australia 2026 | iBudget',
  'Australian first home buyer guide covering stamp duty, borrowing power, mortgage repayments and upfront buying costs.',
  'published', array['stamp-duty','borrowing-power','mortgage'], now()
),
(
  'How Much Mortgage Can You Really Afford? Breaking the Bank''s Rules',
  'how-much-mortgage-can-you-really-afford',
  'Learn why your approved loan amount is not always the same as your comfortable loan amount, especially when life costs change.',
  '# How Much Mortgage Can You Really Afford?

A lender''s borrowing estimate is useful, but it is not the same as a household comfort test. Banks apply serviceability rules, buffers, and assumptions, while you still have to manage groceries, insurance, transport, childcare, repairs, and the unexpected.

## Approval is not the same as comfort

The amount a bank may approve can sit near the top of your limit. A more practical approach is to compare repayments against your real spending habits and leave room for rate changes or income interruptions.

Start with the [borrowing power calculator](/borrowing-power), then compare that result with the [mortgage calculator](/mortgage-calculator).

## Stress test your repayments

Try higher interest rates, shorter loan terms, and different deposit sizes. This helps you see whether the loan still works if your repayments increase or if your regular expenses rise.

## Small extra repayments can change the loan

Even modest extra repayments can reduce interest over time. Once you know the baseline repayment, test what happens with the [extra repayments calculator](/extra-repayments).',
  'How Much Mortgage Can You Really Afford? | iBudget',
  'A practical Australian guide to mortgage affordability, borrowing power and extra repayments.',
  'published', array['mortgage','borrowing-power','extra-repayments'], now()
),
(
  'Stamp Duty By State: NSW, VIC, QLD, WA, SA, TAS, ACT, NT Compared',
  'stamp-duty-by-state-nsw-vic-qld-wa-sa-tas-act-nt-compared',
  'A quick overview of why stamp duty changes depending on where you buy and why state-by-state comparison matters.',
  '# Stamp Duty By State: NSW, VIC, QLD, WA, SA, TAS, ACT, NT Compared

Stamp duty is not the same across Australia. The amount can change based on the state or territory, property value, buyer type, occupancy, and whether a concession or exemption applies.

## Each state uses its own rules

NSW, VIC, QLD, WA, SA, TAS, ACT, and NT all calculate transfer duty differently. This is why a property with the same purchase price can have a different upfront cost depending on where it is located.

Use the [stamp duty calculator](/stamp-duty) to compare states.

## First home buyer concessions can make a large difference

Many buyers focus on the headline purchase price and forget to check whether they qualify for a concession. Eligibility can depend on value thresholds, residency requirements, occupancy rules, and previous ownership history.

## Compare before you make an offer

Running the numbers early helps you understand the full cash required at settlement. This is especially important when comparing suburbs across borders or considering investment purchases.',
  'Stamp Duty By State Australia | iBudget',
  'Compare stamp duty across NSW, VIC, QLD, WA, SA, TAS, ACT and NT using iBudget.',
  'published', array['stamp-duty'], now()
),
(
  'Compound Interest Explained: Why $100 a Month Makes You a Millionaire',
  'compound-interest-explained-why-100-a-month-makes-you-a-millionaire',
  'A simple guide to how regular investing, time, and compounding can turn small monthly contributions into meaningful long-term wealth.',
  '# Compound Interest Explained

Compound interest is powerful because your returns can start earning returns of their own. The earlier you begin, the more time your money has to grow, even if the monthly contribution looks small at the start.

## Time matters more than most people think

The first few years can feel slow because the balance is still small. Over longer periods, compounding can become more noticeable as both your contributions and previous returns keep working together.

Use the [compound interest calculator](/compound-interest) to test different timeframes and monthly contributions.

## $100 a month is a habit, not a magic number

The point is consistency. A regular monthly amount can build the discipline of investing while giving compounding more time to do its work. Higher contributions, longer timeframes, and stronger returns can change the result dramatically.

## Use projections carefully

A calculator can show the maths, but real investment returns are not guaranteed and can move around from year to year. Use projections as a planning tool, not a promise.',
  'Compound Interest Explained Australia | iBudget',
  'Learn how compounding, regular contributions and time can grow long-term savings.',
  'published', array['compound-interest'], now()
)
on conflict (slug) do nothing;
