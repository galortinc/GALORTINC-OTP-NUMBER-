-- Starter schema for a business-owned, consent-based verification workflow.
-- Review and adapt policies before production. Do not use service-role keys in the browser.

create table if not exists public.business_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_name text not null default 'Your business',
  currency text not null default 'NGN',
  created_at timestamptz not null default now()
);

create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  business_service text not null,
  recipient_reference text,
  status text not null default 'pending'
    check (status in ('pending','sent','delivered','failed','cancelled')),
  provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.business_profiles enable row level security;
alter table public.verification_requests enable row level security;
alter table public.audit_logs enable row level security;

create policy "Users can view their own business profile"
on public.business_profiles for select to authenticated
using (id = auth.uid());

create policy "Users can insert their own business profile"
on public.business_profiles for insert to authenticated
with check (id = auth.uid());

create policy "Users can update their own business profile"
on public.business_profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());

create policy "Users can view their own requests"
on public.verification_requests for select to authenticated
using (owner_id = auth.uid());

-- Intentionally no client-side insert/update policy for requests.
-- Create requests through a validated Edge Function after checking authorization,
-- consent, rate limits, and ownership of the business application.
-- Audit logs should be written by trusted server-side code only.
