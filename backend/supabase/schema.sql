create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name varchar(60) not null check (char_length(name) between 20 and 60),
  email text not null unique,
  password text not null,
  address varchar(400),
  role text not null default 'USER' check (role in ('ADMIN', 'USER', 'STORE_OWNER')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  name varchar(60) not null check (char_length(name) between 20 and 60),
  email text not null unique,
  address varchar(400),
  owner_id uuid unique references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  rating integer not null check (rating between 1 and 5),
  user_id uuid not null references public.users(id) on delete cascade,
  store_id uuid not null references public.stores(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, store_id)
);

create index if not exists users_role_idx on public.users(role);
create index if not exists stores_name_idx on public.stores(name);
create index if not exists ratings_store_id_idx on public.ratings(store_id);
create index if not exists ratings_user_id_idx on public.ratings(user_id);

alter table public.users enable row level security;
alter table public.stores enable row level security;
alter table public.ratings enable row level security;

-- The Express server uses SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.
-- Do not place this key in frontend/.env.
notify pgrst, 'reload schema';
