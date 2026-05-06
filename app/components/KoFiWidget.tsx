"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    kofiWidgetOverlay: any;
  }
}

export default function KoFiWidget() {
  useEffect(() => {
    // 防止重复加载
    if (document.querySelector('.kofi-widget-loaded')) return;
    
    const marker = document.createElement('div');
    marker.className = 'kofi-widget-loaded';
    marker.style.display = 'none';
    document.body.appendChild(marker);

    // 加载 Ko-fi overlay widget 脚本（使用官方的正确地址）
    const script = document.createElement('script');
    script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
    script.async = true;
    
    script.onload = () => {
      // 脚本加载后，绘制悬浮按钮
      if (window.kofiWidgetOverlay) {
        window.kofiWidgetOverlay.draw('aiabw', {
          'type': 'floating-chat',
          'floating-chat.donateButton.text': 'Support me',
          'floating-chat.donateButton.background-color': '#29abe0',
          'floating-chat.donateButton.text-color': '#fff'
        });
      }
    };
    
    document.body.appendChild(script);
  }, []);

  return null;
}


