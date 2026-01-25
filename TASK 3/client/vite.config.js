import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/socket.io": {
        target: "http://localhost:5000",
        ws: true,
      },
    },
  },
  // ADD THIS so your preview mode also knows where the server is
  preview: {
    proxy: {
      "/socket.io": {
        target: "http://localhost:5000",
        ws: true,
      },
    },
  },
});
