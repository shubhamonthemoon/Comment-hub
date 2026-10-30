-- Creator Support AI / Comment Hub database foundation
-- Run in Supabase SQL Editor after creating a project.
create extension if not exists pgcrypto;

create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  facebook_url text not null,
  account_type text not null check (account_type in ('Personal profile','Facebook Page')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, facebook_url)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  creator_id uuid references public.creators(id) on delete set null,
  facebook_url text not null,
  caption text not null default '',
  description text not null default '',
  topic text not null default '',
  suggested_comment text not null default '',
  final_comment text not null default '',
  status text not null default 'pending' check (status in ('new','pending','copied','published','failed','skipped','dismissed')),
  discovery_method text not null default 'manual',
  error_message text,
  discovered_at timestamptz not null default now(),
  copied_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, facebook_url)
);

create table if not exists public.comment_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  comment_text text not null,
  action text not null check (action in ('generated','edited','copied','owner_confirmed_published')),
  created_at timestamptz not null default now()
);

create table if not exists public.scan_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  creator_id uuid references public.creators(id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running' check (status in ('running','success','failed','skipped')),
  posts_found integer not null default 0,
  error_message text
);

alter table public.creators enable row level security;
alter table public.posts enable row level security;
alter table public.comment_versions enable row level security;
alter table public.scan_runs enable row level security;

create policy "owners manage their creators" on public.creators
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners manage their posts" on public.posts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners manage their comment versions" on public.comment_versions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners manage their scan runs" on public.scan_runs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists creators_user_active_idx on public.creators(user_id, active);
create index if not exists posts_user_status_created_idx on public.posts(user_id, status, created_at desc);
create index if not exists posts_creator_created_idx on public.posts(creator_id, created_at desc);
create index if not exists comment_versions_post_created_idx on public.comment_versions(post_id, created_at desc);
