import type { PublicTool } from "@/types/ui";

type Props = {
  tool: PublicTool;
  siteUrl: string;
};

/**
 * SoftwareApplication JSON-LD（工具详情 SEO）
 */
export default function ToolJsonLd({ tool, siteUrl }: Props) {
  const pageUrl = `${siteUrl.replace(/\/$/, "")}/tools/${tool.slug}`;
  const json = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": pageUrl,
    name: tool.name,
    description: tool.description,
    url: tool.url,
    applicationCategory: "DeveloperApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
