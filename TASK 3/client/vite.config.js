import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This redirects all socket calls from 5173 to 5000
      "/socket.io": {
        target: "http://localhost:5000",
        ws: true, // Enables WebSocket support
      },
    },
  },
});
