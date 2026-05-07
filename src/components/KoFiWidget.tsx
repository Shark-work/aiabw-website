"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    kofiWidgetOverlay: {
      draw: (username: string, options: Record<string, string>) => void;
    };
  }
}

type Props = {
  donateButtonText?: string;
};

export default function KoFiWidget({ donateButtonText = "Support me" }: Props) {
  useEffect(() => {
    if (document.querySelector(".kofi-widget-loaded")) return;

    const marker = document.createElement("div");
    marker.className = "kofi-widget-loaded";
    marker.style.display = "none";
    document.body.appendChild(marker);

    const script = document.createElement("script");
    script.src = "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
    script.async = true;

    script.onload = () => {
      if (window.kofiWidgetOverlay) {
        window.kofiWidgetOverlay.draw("aiabw", {
          type: "floating-chat",
          "floating-chat.donateButton.text": donateButtonText,
          "floating-chat.donateButton.background-color": "#29abe0",
          "floating-chat.donateButton.text-color": "#fff",
        });
      }
    };

    document.body.appendChild(script);
  }, [donateButtonText]);

  return null;
}
