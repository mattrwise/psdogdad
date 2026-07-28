-- PRE-LAUNCH STOPGAP: auto-confirm new signups
-- Lets new members log in immediately without a confirmation email,
-- while Supabase's built-in email is unreliable. Safe to run more than once.
--
-- REVERSIBLE: before the Aug 1 launch, once real email (Resend) is set up,
-- remove this with:
--   drop trigger if exists auto_confirm_new_user_trigger on auth.users;

create or replace function public.auto_confirm_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.email_confirmed_at is null then
    new.email_confirmed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists auto_confirm_new_user_trigger on auth.users;
create trigger auto_confirm_new_user_trigger
  before insert on auth.users
  for each row execute function public.auto_confirm_new_user();
