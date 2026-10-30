import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
    build: {
        emptyOutDir: true,
        outDir: "dist",
        modulePreload: false,
        cssCodeSplit: false,
        chunkSizeWarningLimit: 1024,
        rolldownOptions: {
            input: resolve(import.meta.dirname, "src/ui.ts"),
            output: {
                entryFileNames: "ui.js",
                assetFileNames: "ui[extname]"
            }
        }
    }
});