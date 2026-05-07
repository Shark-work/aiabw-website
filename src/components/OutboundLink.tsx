"use client";

import type { ReactNode } from "react";

export type OutboundLinkProps = {
  href: string;
  toolSlug: string;
  className?: string;
  children: ReactNode;
};

/**
 * 外跳前先记录点击（POST /api/tools/[slug]/click），失败仍跳转。
 */
export default function OutboundLink({
  href,
  toolSlug,
  className,
  children,
}: OutboundLinkProps) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={async (e) => {
        e.preventDefault();
        try {
          await fetch(`/api/tools/${encodeURIComponent(toolSlug)}/click`, {
            method: "POST",
          });
        } catch {
          /* ignore */
        }
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      {children}
    </a>
  );
}
