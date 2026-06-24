import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During local dev, proxy /api calls to the Vercel dev server (or your own backend)
// so the AI endpoint works without exposing your API key in the browser.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
