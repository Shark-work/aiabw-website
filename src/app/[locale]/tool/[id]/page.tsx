import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

/** 兼容旧路径 /tool/:id → /tools/:slug */
export default async function LegacyToolRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/tools/${encodeURIComponent(id)}`);
}
