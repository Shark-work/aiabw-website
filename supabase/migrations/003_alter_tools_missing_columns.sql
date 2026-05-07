-- 已有旧版 public.tools 表、但缺少本站点所需列时执行（可与 001 并存，重复执行安全）。
-- 在 Supabase → SQL Editor 中粘贴运行。

alter table public.tools add column if not exists tags text[] not null default '{}';
alter table public.tools add column if not exists is_agent boolean not null default false;
alter table public.tools add column if not exists click_count int not null default 0;
alter table public.tools add column if not exists stars int not null default 0;
alter table public.tools add column if not exists is_featured boolean not null default false;
alter table public.tools add column if not exists is_pinned boolean not null default false;
alter table public.tools add column if not exists sort_order int not null default 0;
alter table public.tools add column if not exists logo_url text;
alter table public.tools add column if not exists created_at timestamptz not null default now();
alter table public.tools add column if not exists updated_at timestamptz not null default now();

-- 与 001 一致的更新时间触发器（若尚无）
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
