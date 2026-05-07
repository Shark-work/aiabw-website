"use client";

import { useEffect } from "react";

const KEY = "aiabw-visit-sent";

/**
 * 每个浏览器会话记录一次站点访问（用于看板总访问/今日访问）。
 */
export default function VisitTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, "1");
    void fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname }),
    });
  }, []);
  return null;
}
