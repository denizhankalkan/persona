-- Persona — Supabase schema
-- Run in the SQL editor of a new Supabase project, then `supabase/seed.sql`.

create extension if not exists "pgcrypto";

-- ---------- catalog ----------
create table if not exists brands (
  id text primary key,
  name text not null,
  origin text,
  quality numeric(2,1) default 3, fit numeric(2,1) default 3, fabric numeric(2,1) default 3, price numeric(2,1) default 3,
  left_pct int default 0,
  review_count int default 0
);

create table if not exists items (
  id text primary key,
  type text not null check (type in ('clothing','perfume','product')),
  name text not null,
  category text not null,
  brand_name text,
  brand_id text references brands(id),
  color text default '#999999',
  price_text text,
  year text,
  verification text default 'none' check (verification in ('ok','guess','none')),
  note text,
  notes text,
  search_query text,
  owned_count int default 0,
  url text,        -- official product page; the app reads the share image from it
  image_url text   -- direct photo URL when known
);

create table if not exists personas (
  id text primary key,
  kind text not null check (kind in ('character','person')),
  name text not null,
  short_name text,
  handle text,
  followers text,
  source text,
  bio text,
  tags text[] default '{}',
  color_a text default '#cccccc',
  color_b text default '#333333',
  is_example boolean default false,
  claimed_by uuid references auth.users(id)
);

create table if not exists persona_items (
  persona_id text references personas(id) on delete cascade,
  item_id text references items(id) on delete cascade,
  position int default 0,
  primary key (persona_id, item_id)
);

-- what a public person chose to share about where they bought each item
create table if not exists persona_purchases (
  persona_id text references personas(id) on delete cascade,
  item_id text references items(id) on delete cascade,
  store text not null,
  price_text text,
  url text,
  primary key (persona_id, item_id)
);

create table if not exists scenes (
  id text primary key,
  persona_id text references personas(id) on delete cascade,
  episode text, title text not null, place text
);

create table if not exists scene_items (
  scene_id text references scenes(id) on delete cascade,
  item_id text references items(id) on delete cascade,
  primary key (scene_id, item_id)
);

-- ---------- people ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique,
  name text,
  bio text,
  avatar_url text,
  -- who may see the wardrobe: everyone / accepted followers only / nobody
  visibility text not null default 'followers' check (visibility in ('public','followers','private')),
  -- up to 4 signature pieces (item ids)
  signature text[] not null default '{}',
  created_at timestamptz default now()
);

create or replace function handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, handle, name) values (new.id, split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4), split_part(new.email, '@', 1));
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure handle_new_user();

-- ---------- social ----------
create table if not exists shelves (
  user_id uuid references profiles(id) on delete cascade,
  item_id text references items(id) on delete cascade,
  shelf text not null check (shelf in ('owned','want')),
  -- "nereden aldım": the part people usually hide
  store text,
  price_text text,
  url text,
  -- hidden rows are visible only to their owner, whatever the profile visibility
  hidden boolean not null default false,
  created_at timestamptz default now(),
  primary key (user_id, item_id)
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  target_type text not null check (target_type in ('item','brand','show','style','list')),
  target_id text not null,
  -- 1–5 for a piece or a show; 0 = discussion post on a brand, style or list (not starred)
  rating int not null check (rating between 0 and 5),
  body text default '',
  brand_status text check (brand_status in ('loyal','sometimes','left')),
  tags text[] default '{}',
  created_at timestamptz default now(),
  unique (user_id, target_type, target_id)
);

create table if not exists review_comments (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references reviews(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists follows (
  follower_id uuid references profiles(id) on delete cascade,
  followee_id uuid references profiles(id) on delete cascade,
  -- 'pending' until the followee accepts (only matters when followee.visibility = 'followers')
  status text not null default 'accepted' check (status in ('pending','accepted')),
  created_at timestamptz default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);

-- true when `viewer` may see `owner`'s wardrobe
create or replace function can_view_wardrobe(viewer uuid, owner uuid) returns boolean language sql stable security definer as $$
  select viewer = owner
      or exists (select 1 from profiles p where p.id = owner and p.visibility = 'public')
      or exists (select 1 from profiles p join follows f on f.followee_id = p.id
                 where p.id = owner and p.visibility = 'followers' and f.follower_id = viewer and f.status = 'accepted');
$$;

create table if not exists persona_follows (
  user_id uuid references profiles(id) on delete cascade,
  persona_id text references personas(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, persona_id)
);

-- a user's own photo of an item (Storage bucket "photos", public read) and official link suggestions
create table if not exists item_photos (
  user_id uuid references profiles(id) on delete cascade,
  item_id text references items(id) on delete cascade,
  url text not null,
  created_at timestamptz default now(),
  primary key (user_id, item_id)
);
create table if not exists item_links (
  user_id uuid references profiles(id) on delete cascade,
  item_id text references items(id) on delete cascade,
  url text not null,
  created_at timestamptz default now(),
  primary key (user_id, item_id)
);

-- likes on reviews (no voting on people, no up/down: a like is the only reaction)
create table if not exists review_likes (
  user_id uuid references profiles(id) on delete cascade,
  review_id uuid references reviews(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, review_id)
);

-- pieces added by users through "Ekle" (the catalog grows from here)
create table if not exists user_items (
  id text primary key,
  user_id uuid references profiles(id) on delete cascade,
  type text not null default 'clothing',
  name text not null,
  category text not null default 'Parça',
  brand_name text,
  brand_id text,
  color text,
  price_text text,
  url text,
  image_url text,
  created_at timestamptz default now()
);

-- lists: titled sets of pieces with notes (character wardrobes are editor lists, author_id null)
create table if not exists lists (
  id text primary key,
  author_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  persona_id text references personas(id) on delete set null,
  saves int not null default 0,
  created_at timestamptz default now()
);
create table if not exists list_saves (
  user_id uuid references profiles(id) on delete cascade,
  list_id text references lists(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, list_id)
);
create table if not exists list_items (
  list_id text references lists(id) on delete cascade,
  item_id text not null,
  note text,
  position int not null default 0,
  primary key (list_id, item_id)
);

create table if not exists brand_tips (
  user_id uuid references profiles(id) on delete cascade,
  item_id text references items(id) on delete cascade,
  brand text not null,
  created_at timestamptz default now(),
  primary key (user_id, item_id)
);

-- ---------- row level security ----------
alter table brands enable row level security;
alter table items enable row level security;
alter table personas enable row level security;
alter table persona_items enable row level security;
alter table persona_purchases enable row level security;
alter table scenes enable row level security;
alter table scene_items enable row level security;
alter table profiles enable row level security;
alter table shelves enable row level security;
alter table reviews enable row level security;
alter table review_comments enable row level security;
alter table follows enable row level security;
alter table persona_follows enable row level security;
alter table brand_tips enable row level security;
alter table review_likes enable row level security;
alter table user_items enable row level security;
alter table lists enable row level security;
alter table list_items enable row level security;
alter table list_saves enable row level security;
alter table item_photos enable row level security;
alter table item_links enable row level security;

-- catalog: everyone reads, nobody writes from the client
create policy "catalog read" on brands for select using (true);
create policy "catalog read" on items for select using (true);
create policy "catalog read" on personas for select using (true);
create policy "catalog read" on persona_items for select using (true);
create policy "catalog read" on persona_purchases for select using (true);
create policy "catalog read" on scenes for select using (true);
create policy "catalog read" on scene_items for select using (true);

-- profiles: public read, own write
create policy "profiles read" on profiles for select using (true);
create policy "profiles own" on profiles for insert with check (auth.uid() = id);
create policy "profiles own update" on profiles for update using (auth.uid() = id);

-- shelves: the permission model lives here. Owner sees everything; others see
-- non-hidden rows only when the owner allows (public, or accepted follower).
create policy "shelves read" on shelves for select using (
  auth.uid() = user_id
  or (hidden = false and can_view_wardrobe(auth.uid(), user_id))
);
create policy "shelves own" on shelves for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reviews read" on reviews for select using (auth.role() = 'authenticated');
create policy "reviews own" on reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "comments read" on review_comments for select using (auth.role() = 'authenticated');
create policy "comments own" on review_comments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- follows: anyone signed in may read accepted follows; pending requests are visible
-- only to the two people involved. Follower creates/deletes; followee may accept or decline.
create policy "follows read" on follows for select using (
  auth.role() = 'authenticated' and (status = 'accepted' or auth.uid() in (follower_id, followee_id))
);
create policy "follows request" on follows for insert with check (
  auth.uid() = follower_id and status = (case when (select visibility from profiles where id = followee_id) = 'public' then 'accepted' else 'pending' end)
);
create policy "follows withdraw" on follows for delete using (auth.uid() in (follower_id, followee_id));
create policy "follows accept" on follows for update using (auth.uid() = followee_id) with check (auth.uid() = followee_id and status = 'accepted');
create policy "pfollows read" on persona_follows for select using (auth.role() = 'authenticated');
create policy "pfollows own" on persona_follows for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tips read" on brand_tips for select using (auth.role() = 'authenticated');
create policy "tips own" on brand_tips for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "photos read" on item_photos for select using (auth.uid() = user_id or can_view_wardrobe(auth.uid(), user_id));
create policy "photos own" on item_photos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "links read" on item_links for select using (auth.role() = 'authenticated');
create policy "links own" on item_links for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Storage: create a public bucket named "photos" in the dashboard (Storage → New bucket → public).

-- ---------- derived counts (kept simple: recomputed by triggers) ----------
create or replace function bump_owned_count() returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT' and new.shelf = 'owned') then update items set owned_count = owned_count + 1 where id = new.item_id; end if;
  if (tg_op = 'DELETE' and old.shelf = 'owned') then update items set owned_count = greatest(owned_count - 1, 0) where id = old.item_id; end if;
  return null;
end $$;
drop trigger if exists shelves_count on shelves;
create trigger shelves_count after insert or delete on shelves for each row execute procedure bump_owned_count();

create or replace function refresh_brand_stats() returns trigger language plpgsql as $$
declare bid text := coalesce(new.target_id, old.target_id);
begin
  if coalesce(new.target_type, old.target_type) = 'brand' then
    update brands b set
      review_count = (select count(*) from reviews r where r.target_type = 'brand' and r.target_id = bid),
      left_pct = coalesce((select round(100.0 * sum(case when r.brand_status = 'left' then 1 else 0 end) / nullif(count(*), 0)) from reviews r where r.target_type = 'brand' and r.target_id = bid), 0)
    where b.id = bid;
  end if;
  return null;
end $$;
drop trigger if exists reviews_brand_stats on reviews;
create trigger reviews_brand_stats after insert or update or delete on reviews for each row execute procedure refresh_brand_stats();

-- ---------- policies for the new tables ----------
drop policy if exists likes_read on review_likes; create policy likes_read on review_likes for select using (true);
drop policy if exists likes_write on review_likes; create policy likes_write on review_likes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists user_items_read on user_items; create policy user_items_read on user_items for select using (true);
drop policy if exists user_items_write on user_items; create policy user_items_write on user_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists lists_read on lists; create policy lists_read on lists for select using (true);
drop policy if exists lists_write on lists; create policy lists_write on lists for all using (auth.uid() = author_id) with check (auth.uid() = author_id);
drop policy if exists list_items_read on list_items; create policy list_items_read on list_items for select using (true);
drop policy if exists list_items_write on list_items; create policy list_items_write on list_items for all
  using (exists (select 1 from lists l where l.id = list_id and l.author_id = auth.uid()))
  with check (exists (select 1 from lists l where l.id = list_id and l.author_id = auth.uid()));
drop policy if exists list_saves_read on list_saves; create policy list_saves_read on list_saves for select using (true);
drop policy if exists list_saves_write on list_saves; create policy list_saves_write on list_saves for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
