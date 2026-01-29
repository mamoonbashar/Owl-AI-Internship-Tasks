import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import devtoolsJson from "vite-plugin-devtools-json";
export default defineConfig({
  plugins: [react(), devtoolsJson(),],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your Express Server Address
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
