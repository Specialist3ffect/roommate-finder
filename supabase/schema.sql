-- RoomMatch database schema for Supabase (Postgres)
-- Run this in the Supabase SQL Editor to set up the backend.
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS.

-- ---------------------------------------------------------------------------
-- Listings: a person who either has a room or needs one.
-- ---------------------------------------------------------------------------
create table if not exists public.listings (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  kind        text not null check (kind in ('has-room', 'needs-room')),
  name        text not null,
  age         int  not null default 25 check (age between 18 and 120),
  headline    text not null,
  bio         text not null default '',
  city        text not null,
  lat         double precision not null,
  lng         double precision not null,
  budget      int  not null default 1000 check (budget >= 0),
  move_in     date,
  tags        text[] not null default '{}',
  avatar_color text not null default '#1f57e0'
);

create index if not exists listings_created_at_idx on public.listings (created_at desc);
create index if not exists listings_kind_idx on public.listings (kind);

-- ---------------------------------------------------------------------------
-- Messages: an inquiry sent to a listing.
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  listing_id   uuid not null references public.listings (id) on delete cascade,
  sender_name  text not null,
  sender_email text not null,
  body         text not null check (char_length(body) between 1 and 2000)
);

create index if not exists messages_listing_id_idx on public.messages (listing_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- NOTE: this demo policy allows anonymous reads/inserts so the app works
-- without auth. For production, add Supabase Auth and scope writes to
-- auth.uid(), and do NOT expose message reads publicly.
alter table public.listings enable row level security;
alter table public.messages enable row level security;

drop policy if exists "listings public read" on public.listings;
create policy "listings public read"
  on public.listings for select using (true);

drop policy if exists "listings anon insert" on public.listings;
create policy "listings anon insert"
  on public.listings for insert with check (true);

-- Messages: anyone may send (insert) an inquiry, but nobody can read them via
-- the anon key. Read them from a trusted server context / the dashboard only.
drop policy if exists "messages anon insert" on public.messages;
create policy "messages anon insert"
  on public.messages for insert with check (true);
