import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import {fileURLToPath} from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
});
