import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

const path = fileURLToPath(import.meta.url);
const root = resolve(dirname(path));

// https://vitejs.dev/config/
export default defineConfig({
  root,
  plugins: [react()],
  server: {
    cors: true,
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
});
