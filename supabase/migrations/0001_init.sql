-- ActiveAid MVP schema (local-first, auth-ready)
-- Apply in Supabase SQL editor or via CLI migrations.

-- Extensions (Supabase typically enables these, but keep it explicit)
create extension if not exists "pgcrypto";

-- 1) wellness_logs: relief sessions + completion events
create table if not exists public.wellness_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  session_type text not null,
  duration_seconds integer not null default 0,
  completed boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists wellness_logs_user_id_created_at_idx
  on public.wellness_logs (user_id, created_at desc);

-- 2) discomfort_logs: daily check-ins (supports multiple body areas)
create table if not exists public.discomfort_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  severity text not null check (severity in ('great', 'slight', 'moderate', 'severe')),
  body_areas text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  date date not null default (now() at time zone 'utc')::date,
  unique (user_id, date)
);

create index if not exists discomfort_logs_user_id_date_idx
  on public.discomfort_logs (user_id, date desc);

-- 3) reminder_settings: per-user reminder config
create table if not exists public.reminder_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  reminder_interval_minutes integer not null default 90,
  notifications_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on update
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reminder_settings_set_updated_at on public.reminder_settings;
create trigger reminder_settings_set_updated_at
before update on public.reminder_settings
for each row
execute function public.set_updated_at();

-- RLS
alter table public.wellness_logs enable row level security;
alter table public.discomfort_logs enable row level security;
alter table public.reminder_settings enable row level security;

-- Policies (auth-required)
drop policy if exists wellness_logs_select_own on public.wellness_logs;
create policy wellness_logs_select_own
on public.wellness_logs
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists wellness_logs_insert_own on public.wellness_logs;
create policy wellness_logs_insert_own
on public.wellness_logs
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists discomfort_logs_select_own on public.discomfort_logs;
create policy discomfort_logs_select_own
on public.discomfort_logs
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists discomfort_logs_upsert_own on public.discomfort_logs;
create policy discomfort_logs_upsert_own
on public.discomfort_logs
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists discomfort_logs_update_own on public.discomfort_logs;
create policy discomfort_logs_update_own
on public.discomfort_logs
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists reminder_settings_select_own on public.reminder_settings;
create policy reminder_settings_select_own
on public.reminder_settings
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists reminder_settings_upsert_own on public.reminder_settings;
create policy reminder_settings_upsert_own
on public.reminder_settings
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists reminder_settings_update_own on public.reminder_settings;
create policy reminder_settings_update_own
on public.reminder_settings
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

