-- Vice City Feed — paste this entire file into the Supabase SQL editor
-- (Project → SQL → New query → Run). The static site uses the anon key only;
-- it cannot apply this schema itself.
--
-- After this runs:
--   1. Authentication → Providers → Email: enable Email.
--   2. Authentication → Providers → Email: turn OFF "Allow new users to sign up"
--      (or disable public sign-ups under Auth settings) so only the user you
--      create can reach the desk.
--   3. Authentication → Users → Add user: email + password, auto-confirm.
--      That account is the admin. Sign in at /admin. RLS lets any
--      authenticated user insert/update/delete; with sign-up closed, that
--      is only the user you added.
--   4. Publish a story from /admin. Unknown /posts/<slug> URLs resolve through
--      the GitHub Pages 404 fallback.

create extension if not exists pgcrypto;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  category text not null
    check (category in ('Leaks & News', 'Map & Lore', 'Vehicles & Guns', 'Guides')),
  section text not null
    check (section in ('wire', 'intel', 'map', 'garage', 'reviews')),
  author_name text not null,
  author_role text not null default 'Desk',
  author_handle text not null default '',
  tags text[] not null default '{}',
  cover_accent text not null default 'cyan'
    check (cover_accent in ('cyan', 'magenta', 'sunset')),
  cover_scene text not null default 'coast'
    check (
      cover_scene in (
        'coast',
        'city',
        'car',
        'map',
        'gun',
        'interior',
        'swamp',
        'port',
        'marina',
        'street',
        'club',
        'workshop',
        'portrait',
        'desk'
      )
    ),
  cover_image_url text,
  featured boolean not null default false,
  hero_rank smallint,
  breaking boolean not null default false,
  related_slugs text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists articles_published_at_idx
  on public.articles (published_at desc)
  where published = true;

create index if not exists articles_slug_published_idx
  on public.articles (slug)
  where published = true;

create or replace function public.set_articles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row
  execute procedure public.set_articles_updated_at();

grant select on table public.articles to anon;
grant select, insert, update, delete on table public.articles to authenticated;

alter table public.articles enable row level security;

drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles"
  on public.articles
  for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Authenticated can read all articles" on public.articles;
create policy "Authenticated can read all articles"
  on public.articles
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can insert articles" on public.articles;
create policy "Authenticated can insert articles"
  on public.articles
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update articles" on public.articles;
create policy "Authenticated can update articles"
  on public.articles
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete articles" on public.articles;
create policy "Authenticated can delete articles"
  on public.articles
  for delete
  to authenticated
  using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'covers',
  'covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read covers" on storage.objects;
create policy "Public can read covers"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'covers');

drop policy if exists "Authenticated can upload covers" on storage.objects;
create policy "Authenticated can upload covers"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'covers');

drop policy if exists "Authenticated can update covers" on storage.objects;
create policy "Authenticated can update covers"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'covers')
  with check (bucket_id = 'covers');

drop policy if exists "Authenticated can delete covers" on storage.objects;
create policy "Authenticated can delete covers"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'covers');

-- Additive no-ops if the create-table block above already ran.
alter table public.articles add column if not exists cover_image_url text;
alter table public.articles add column if not exists published boolean not null default false;
