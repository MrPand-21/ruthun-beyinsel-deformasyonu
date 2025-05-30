/// <reference types="lucia" />
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: Nullable<import("lucia").User>;
      session: Nullable<import("lucia").Session>;
    }
    interface PageData {
      // Your page data types here
    }
    interface Error {
      // Your error types here
    }
    interface Platform {
      // Your platform types here
    }
  }

  // Add gtag related types
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }

  function gtag(...args: any[]): void;
}

// Declare your environment variables
declare namespace ImportMetaEnv {
  PUBLIC_GOOGLE_TAG_MEASUREMENT_ID: string;
}

declare module "$env/static/public" {
  export const PUBLIC_GOOGLE_TAG_MEASUREMENT_ID: string;
}

export { };
