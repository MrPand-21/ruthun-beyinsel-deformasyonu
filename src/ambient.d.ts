/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module "*.png?as=run" {
  const content: string;
  export default content;
}

declare module "*.jpg?as=run" {
  const content: string;
  export default content;
}

declare module "*.jpeg?as=run" {
  const content: string;
  export default content;
}

declare module "*.svg?as=run" {
  const content: string;
  export default content;
}
