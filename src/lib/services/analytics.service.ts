import type { AnalyticsDto } from "$lib/types";
import { PUBLIC_LANDING_PAGE } from "$env/static/public";

export const getSiteAnalytics = async (): Promise<AnalyticsDto> => {
  const userAgent = navigator.userAgent;
  const isIncognitoMode = await detectIncognito();

  return {
    browserHash: await generateBrowserHash(),
    landingPage: PUBLIC_LANDING_PAGE,
    isIncognitoMode,
    userAgent,
    referralSiteUrl: document.referrer || undefined,
  };
};

const generateBrowserHash = async (): Promise<string> => {
  // Simple hash generation for demo
  const text = navigator.userAgent + navigator.language + navigator.platform;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const detectIncognito = async (): Promise<boolean> => {
  try {
    const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
    return new Promise((resolve) => {
      fs?.(
        window.TEMPORARY,
        100,
        () => resolve(false),
        () => resolve(true),
      );
    });
  } catch {
    return false;
  }
};
