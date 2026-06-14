-- ============================================================
-- 003_auth_trigger.sql — Auto-create user_profile on signup
-- ============================================================

-- When a new user registers via Supabase Auth, create their profile.
-- The app must pass { role, restaurant_id } in raw_user_meta_data.
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_profiles (id, restaurant_id, full_name, role)
  values (
    new.id,
    (new.raw_user_meta_data->>'restaurant_id')::uuid,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'waiter')::user_role
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
