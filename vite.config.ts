import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const isLib = mode === 'lib';
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: isLib ? {
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        name: "SwapPaySDK",
        formats: ["es", "cjs"],
        fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
      },
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          '@rainbow-me/rainbowkit',
          '@tanstack/react-query',
          'viem',
          'wagmi'
        ],
        output: {
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'react/jsx-runtime'
          }
        }
      },
      sourcemap: true,
      emptyOutDir: true
    } : undefined
  };
});
