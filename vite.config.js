import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const allowedHost = env.VITE_ALLOWED_HOST;

  return {
    plugins: [react()],
    server: {
      allowedHosts: allowedHost ? [allowedHost] : undefined
    }
  };
});
