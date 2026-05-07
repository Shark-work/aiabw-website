-- 若你在 Supabase Dashboard 为表开启了 RLS，匿名 key 访问 PostgREST 会失败（permission denied / PGRST301）。
-- 本站点默认模型为「经 Next.js 服务端访问数据库」；与 001_init 一致时应对 public 表关闭 RLS。
-- 请先执行 001_init.sql 建好表后再执行本文件。

alter table public.categories disable row level security;
alter table public.tools disable row level security;
alter table public.tool_clicks disable row level security;
alter table public.site_visits disable row level security;
