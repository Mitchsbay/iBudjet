-- iBudget: saved_calculations table
-- Run this in your Supabase SQL editor or via the Supabase CLI

create table if not exists public.saved_calculations (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  calculator_type text not null,          -- 'mortgage' | 'extra-repayments' | etc.
  label       text,                       -- optional user-supplied name
  input_data  jsonb not null default '{}',
  result_data jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

-- Row Level Security: users can only see and modify their own rows
alter table public.saved_calculations enable row level security;

create policy "Users can read own calculations"
  on public.saved_calculations for select
  using (auth.uid() = user_id);

create policy "Users can insert own calculations"
  on public.saved_calculations for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own calculations"
  on public.saved_calculations for delete
  using (auth.uid() = user_id);

-- Index for fast per-user queries
create index if not exists idx_saved_calculations_user_id
  on public.saved_calculations(user_id, calculator_type, created_at desc);
