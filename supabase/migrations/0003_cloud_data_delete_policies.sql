-- Allow authenticated users to delete their own optional cloud-backup data.

grant delete on table public.wellness_logs to authenticated;
grant delete on table public.discomfort_logs to authenticated;
grant delete on table public.reminder_settings to authenticated;

drop policy if exists wellness_logs_delete_own on public.wellness_logs;
create policy wellness_logs_delete_own
on public.wellness_logs
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists discomfort_logs_delete_own on public.discomfort_logs;
create policy discomfort_logs_delete_own
on public.discomfort_logs
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists reminder_settings_delete_own on public.reminder_settings;
create policy reminder_settings_delete_own
on public.reminder_settings
for delete
to authenticated
using (auth.uid() = user_id);
