import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { componentTagger } from "lovable-tagger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // ⬇️ This line fixes Register/Login page 404 in deployment
    open: false,
  },
  build: {
    // ⬇️ VERY IMPORTANT — enables routing rebuild
    rollupOptions: {
      input: "index.html",
    },
  },
  // ⬇️ This makes Vercel serve index.html for every route
  preview: {
    port: 8080,
    host: "::",
    open: false,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
