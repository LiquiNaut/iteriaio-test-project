/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    server: {
      deps: {
        inline: [
          "@refinedev/mui",
          "@mui/material",
          "@mui/x-data-grid",
          "@refinedev/react-router",
          "react-router",
          "react-router-dom",
        ],
      },
    },
  },
});
