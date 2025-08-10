// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: if your repo name is not "helloworld", change the base accordingly.
export default defineConfig({
  plugins: [react()],
  base: "/helloworld/",
});
