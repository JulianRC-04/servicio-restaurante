-- ============================================================
-- 002_rls_policies.sql — Row Level Security policies
-- ============================================================

-- Helper: get the calling user's restaurant_id and role
create or replace function auth_restaurant_id()
returns uuid language sql security definer stable as $$
  select restaurant_id from user_profiles where id = auth.uid();
$$;

create or replace function auth_role()
returns user_role language sql security definer stable as $$
  select role from user_profiles where id = auth.uid();
$$;

-- ─── restaurants ────────────────────────────────────────────
-- Owners can read their own restaurant. No one else.
create policy "owner reads own restaurant"
  on restaurants for select
  using (id = auth_restaurant_id());

create policy "owner updates own restaurant"
  on restaurants for update
  using (id = auth_restaurant_id() and auth_role() = 'owner');

-- ─── user_profiles ──────────────────────────────────────────
-- Each user sees only their own profile row.
create policy "user reads own profile"
  on user_profiles for select
  using (id = auth.uid());

-- Owners can see all profiles in their restaurant.
create policy "owner reads staff profiles"
  on user_profiles for select
  using (restaurant_id = auth_restaurant_id() and auth_role() = 'owner');

create policy "owner manages staff"
  on user_profiles for all
  using (restaurant_id = auth_restaurant_id() and auth_role() = 'owner');

-- ─── tables ─────────────────────────────────────────────────
create policy "staff reads tables"
  on tables for select
  using (restaurant_id = auth_restaurant_id());

create policy "owner manages tables"
  on tables for all
  using (restaurant_id = auth_restaurant_id() and auth_role() = 'owner');

create policy "waiter updates table status"
  on tables for update
  using (restaurant_id = auth_restaurant_id() and auth_role() in ('owner', 'waiter'));

-- ─── categories ─────────────────────────────────────────────
create policy "staff reads categories"
  on categories for select
  using (restaurant_id = auth_restaurant_id());

create policy "owner manages categories"
  on categories for all
  using (restaurant_id = auth_restaurant_id() and auth_role() = 'owner');

-- ─── products ───────────────────────────────────────────────
create policy "staff reads products"
  on products for select
  using (restaurant_id = auth_restaurant_id());

create policy "owner manages products"
  on products for all
  using (restaurant_id = auth_restaurant_id() and auth_role() = 'owner');

-- ─── inventory_lots ─────────────────────────────────────────
create policy "owner reads inventory"
  on inventory_lots for select
  using (
    (select restaurant_id from products where id = product_id) = auth_restaurant_id()
    and auth_role() = 'owner'
  );

create policy "owner manages inventory"
  on inventory_lots for all
  using (
    (select restaurant_id from products where id = product_id) = auth_restaurant_id()
    and auth_role() = 'owner'
  );

-- ─── orders ─────────────────────────────────────────────────
-- All staff in the restaurant can read orders.
create policy "staff reads orders"
  on orders for select
  using (restaurant_id = auth_restaurant_id());

-- Waiters and owners can create orders.
create policy "waiter creates order"
  on orders for insert
  with check (restaurant_id = auth_restaurant_id() and auth_role() in ('owner', 'waiter'));

-- Kitchen/bar/waiter/owner can update order status.
create policy "staff updates order"
  on orders for update
  using (restaurant_id = auth_restaurant_id());

-- ─── order_items ────────────────────────────────────────────
create policy "staff reads order items"
  on order_items for select
  using (
    (select restaurant_id from orders where id = order_id) = auth_restaurant_id()
  );

create policy "waiter manages order items"
  on order_items for all
  using (
    (select restaurant_id from orders where id = order_id) = auth_restaurant_id()
    and auth_role() in ('owner', 'waiter')
  );

create policy "kitchen updates item status"
  on order_items for update
  using (
    (select restaurant_id from orders where id = order_id) = auth_restaurant_id()
    and auth_role() in ('kitchen', 'bar', 'owner', 'waiter')
  );
