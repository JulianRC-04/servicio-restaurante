-- ============================================================
-- 001_schema.sql — Core schema for servicio-restaurante
-- Run this in Supabase SQL Editor (or via supabase db push)
-- ============================================================

-- ─── Extensions ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── restaurants ────────────────────────────────────────────
-- Future multi-tenant support: each restaurant is a tenant.
create table restaurants (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

-- ─── user_profiles ──────────────────────────────────────────
create type user_role as enum ('owner', 'waiter', 'kitchen', 'bar');

create table user_profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  restaurant_id  uuid references restaurants(id) on delete cascade,
  full_name      text,
  role           user_role not null default 'waiter',
  created_at     timestamptz not null default now()
);

-- ─── tables ─────────────────────────────────────────────────
create type table_status as enum ('available', 'occupied', 'reserved', 'cleaning');

create table tables (
  id             uuid primary key default uuid_generate_v4(),
  restaurant_id  uuid not null references restaurants(id) on delete cascade,
  number         int not null,
  capacity       int not null default 4,
  status         table_status not null default 'available',
  qr_code        text,                  -- URL/token for QR mode
  created_at     timestamptz not null default now(),
  unique (restaurant_id, number)
);

-- ─── categories ─────────────────────────────────────────────
create table categories (
  id             uuid primary key default uuid_generate_v4(),
  restaurant_id  uuid not null references restaurants(id) on delete cascade,
  name           text not null,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now()
);

-- ─── products ───────────────────────────────────────────────
create type product_destination as enum ('kitchen', 'bar', 'both');

create table products (
  id             uuid primary key default uuid_generate_v4(),
  restaurant_id  uuid not null references restaurants(id) on delete cascade,
  category_id    uuid references categories(id) on delete set null,
  name           text not null,
  description    text,
  price          numeric(10,2) not null,
  stock          int not null default 0,
  destination    product_destination not null default 'kitchen',
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ─── inventory_lots ─────────────────────────────────────────
-- Batch registry: entry date + expiry date (for FIFO + alerts)
create table inventory_lots (
  id             uuid primary key default uuid_generate_v4(),
  product_id     uuid not null references products(id) on delete cascade,
  quantity       int not null,
  entry_date     date not null default current_date,
  expiry_date    date,
  notes          text,
  created_at     timestamptz not null default now()
);

-- ─── orders ─────────────────────────────────────────────────
create type order_status as enum ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');
create type order_mode   as enum ('qr', 'waiter', 'both');

create table orders (
  id             uuid primary key default uuid_generate_v4(),
  restaurant_id  uuid not null references restaurants(id) on delete cascade,
  table_id       uuid not null references tables(id) on delete restrict,
  waiter_id      uuid references user_profiles(id) on delete set null,
  status         order_status not null default 'pending',
  mode           order_mode   not null default 'waiter',
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ─── order_items ────────────────────────────────────────────
create type item_status as enum ('pending', 'preparing', 'ready', 'delivered', 'cancelled');

create table order_items (
  id           uuid primary key default uuid_generate_v4(),
  order_id     uuid not null references orders(id) on delete cascade,
  product_id   uuid not null references products(id) on delete restrict,
  quantity     int not null default 1,
  unit_price   numeric(10,2) not null,
  status       item_status not null default 'pending',
  notes        text,
  created_at   timestamptz not null default now()
);

-- ─── updated_at trigger ─────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- ─── RLS: enable on all tables ──────────────────────────────
alter table restaurants     enable row level security;
alter table user_profiles   enable row level security;
alter table tables          enable row level security;
alter table categories      enable row level security;
alter table products        enable row level security;
alter table inventory_lots  enable row level security;
alter table orders          enable row level security;
alter table order_items     enable row level security;
