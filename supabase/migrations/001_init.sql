-- AIABW 工具导航站：在 Supabase SQL Editor 中执行，或作为迁移运行
-- 域名示例: https://aiabw.com

create extension if not exists "pgcrypto";

-- 分类
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 工具（运营主表）
create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  url text not null,
  category text not null,
  tags text[] not null default '{}',
  is_agent boolean not null default false,
  click_count int not null default 0,
  stars int not null default 0,
  is_featured boolean not null default false,
  is_pinned boolean not null default false,
  sort_order int not null default 0,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 点击事件（趋势图 / 今日点击）
create table if not exists public.tool_clicks (
  id bigserial primary key,
  tool_id uuid not null references public.tools (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 站点访问（总访问量 / 今日访问）
create table if not exists public.site_visits (
  id bigserial primary key,
  path text,
  created_at timestamptz not null default now()
);

create index if not exists idx_tools_category on public.tools (category);
create index if not exists idx_tools_featured on public.tools (is_featured);
create index if not exists idx_tool_clicks_created on public.tool_clicks (created_at);
create index if not exists idx_site_visits_created on public.site_visits (created_at);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_tools_updated_at on public.tools;
create trigger trg_tools_updated_at
before update on public.tools
for each row execute function public.set_updated_at();

-- RLS：本项目所有读写经 Next.js API + service role。若需直连 Supabase，请自行启用并编写策略。
alter table public.categories disable row level security;
alter table public.tools disable row level security;
alter table public.tool_clicks disable row level security;
alter table public.site_visits disable row level security;

-- 种子数据（可按需修改）
insert into public.categories (name, slug, sort_order) values
  ('开发工具', 'dev', 10),
  ('AI 建站', 'site-builder', 20),
  ('Agent 工具', 'agent', 30)
on conflict (slug) do nothing;

insert into public.tools (
  slug, name, description, url, category, tags, is_agent, click_count, stars, is_featured, sort_order, logo_url
) values
(
  'cursor',
  'Cursor',
  '与 AI 配对编程的代码编辑器。',
  'https://cursor.sh',
  'dev',
  array['coding','free']::text[],
  false,
  12800,
  9600,
  true,
  1,
  'https://www.cursor.com/favicon.ico'
),
(
  'manus',
  'Manus',
  '一句话生成网站，AI 建站助手。',
  'https://manus.im',
  'site-builder',
  array['site-builder','productivity']::text[],
  true,
  8200,
  5100,
  true,
  2,
  null
),
(
  'openclaw',
  'OpenClaw',
  '开源 AI Agent，7×24 小时自动化执行任务。',
  'https://openclaw.ai',
  'agent',
  array['open-source','automation']::text[],
  true,
  5400,
  3200,
  false,
  3,
  null
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  url = excluded.url,
  category = excluded.category,
  tags = excluded.tags,
  is_agent = excluded.is_agent,
  logo_url = excluded.logo_url;
