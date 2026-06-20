-- Optional cloud sync: dedupe wellness session rows from extension clients
alter table public.wellness_logs
  add column if not exists client_event_id text;

create unique index if not exists wellness_logs_user_client_event_uidx
  on public.wellness_logs (user_id, client_event_id)
  where client_event_id is not null;

drop policy if exists wellness_logs_update_own on public.wellness_logs;
create policy wellness_logs_update_own
on public.wellness_logs
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
