export {};

/// <reference types="vite/client" />
declare module "number-to-chinese-words" {
    export default {
      toWords: (value: number) => string,
    };
  }
  