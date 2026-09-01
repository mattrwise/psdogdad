-- Forum posts and replies. Safe to run more than once.
--
-- Why this file exists late: both tables were created by hand in the Supabase
-- dashboard and never written down, so they were the only live tables whose
-- shape could not be read from this repo. That is what made a routine question
-- -- "if I delete a member, what happens to their posts?" -- unanswerable
-- without opening the dashboard.
--
-- Reconstructed on 29 August 2026 from the columns the live tables return and
-- from every query the app makes against them:
--   app/forums/page.tsx, components/forums/ForumPostList.tsx,
--   components/forums/NewPostModal.tsx, components/home/LatestDiscussionsPreview.tsx
--
-- `create table if not exists` means running this against the live database
-- will NOT alter the existing tables -- it only creates them where they are
-- missing, and re-asserts the policies. Treat the column definitions below as
-- the intended shape; if the live table disagrees, the live table is what is
-- running. The policies at the bottom are re-applied on every run and those
-- WILL take effect.

create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  -- Denormalised at insert so a thread list can show an author without a join.
  -- It is also why a post outlives its author readably: on delete set null
  -- clears user_id, and this still says who wrote it.
  author_name text not null,
  -- Slug, matching the eight in app/sitemap.ts. Not an enum or an FK: the
  -- category list lives in the code and has been edited more than once.
  category text not null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

-- Both list views sort newest-first, and replies are always fetched by post.
create index if not exists forum_posts_category_created_idx
  on public.forum_posts (category, created_at desc);
create index if not exists forum_replies_post_idx
  on public.forum_replies (post_id, created_at);

alter table public.forum_posts enable row level security;
alter table public.forum_replies enable row level security;

-- The forum is readable signed out; that is the point of it as a front door.
drop policy if exists "Anyone can view forum posts" on public.forum_posts;
create policy "Anyone can view forum posts"
  on public.forum_posts for select to public using (true);

drop policy if exists "Members can post" on public.forum_posts;
create policy "Members can post"
  on public.forum_posts for insert to public
  with check (auth.uid() = user_id);

drop policy if exists "Authors can edit their posts" on public.forum_posts;
create policy "Authors can edit their posts"
  on public.forum_posts for update to public
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Authors can delete their posts" on public.forum_posts;
create policy "Authors can delete their posts"
  on public.forum_posts for delete to public
  using (auth.uid() = user_id);

drop policy if exists "Anyone can view forum replies" on public.forum_replies;
create policy "Anyone can view forum replies"
  on public.forum_replies for select to public using (true);

drop policy if exists "Members can reply" on public.forum_replies;
create policy "Members can reply"
  on public.forum_replies for insert to public
  with check (auth.uid() = user_id);

drop policy if exists "Authors can edit their replies" on public.forum_replies;
create policy "Authors can edit their replies"
  on public.forum_replies for update to public
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Authors can delete their replies" on public.forum_replies;
create policy "Authors can delete their replies"
  on public.forum_replies for delete to public
  using (auth.uid() = user_id);
