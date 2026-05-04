import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Get the directory name in a way that works in both local and CI environments
const projectRoot = path.resolve(process.cwd());

export default defineConfig({
  // Using relative base ensures assets load regardless of subdomains
  base: "./", 
  
  plugins: [
    react(),
    tailwindcss()
  ],

  resolve: {
    alias: {
      // Direct mapping of the @ symbol to your src folder
      "@": path.resolve(projectRoot, "src"),
      "@assets": path.resolve(projectRoot, "src/assets"),
    },
    // Helps prevent "Multiple versions of React" errors
    dedupe: ["react", "react-dom"],
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    sourcemap: false, // Keeps build small and avoids Cloudflare upload warnings
    rollupOptions: {
      output: {
        // Helps with the "Chunks larger than 500kb" warning
        manualChunks: {
          vendor: ["react", "react-dom", "framer-motion", "wouter"],
          ui: ["lucide-react"]
        }
      }
    }
  },

  server: {
    port: 3000,
    strictPort: true,
    host: "0.0.0.0",
  }
});
