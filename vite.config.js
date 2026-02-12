import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "3723-2406-7400-56-30e1-7dc1-d346-9e7b-6cc9.ngrok-free.app"
    ]
  }
});
