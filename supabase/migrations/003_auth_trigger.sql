-- ============================================================
-- 003_auth_trigger.sql — Auto-create user_profile on signup
-- ============================================================

-- When a new user registers via Supabase Auth, create their profile.
-- The app must pass { role, restaurant_id } in raw_user_meta_data.
-- When created via the dashboard, metadata may be absent — defaults are applied.
create or replace function handle_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  _restaurant_id uuid;
  _role          text;
  _full_name     text;
begin
  -- Safely parse restaurant_id — ignore if not a valid uuid
  begin
    _restaurant_id := (new.raw_user_meta_data->>'restaurant_id')::uuid;
  exception when others then
    _restaurant_id := null;
  end;

  -- Safely parse role — fall back to 'waiter'
  begin
    _role := coalesce(new.raw_user_meta_data->>'role', 'waiter')::user_role;
  exception when others then
    _role := 'waiter';
  end;

  _full_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    new.email
  );

  insert into public.user_profiles (id, restaurant_id, full_name, role)
  values (new.id, _restaurant_id, _full_name, _role::public.user_role)
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Drop and recreate trigger to avoid duplicate errors on re-run
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
