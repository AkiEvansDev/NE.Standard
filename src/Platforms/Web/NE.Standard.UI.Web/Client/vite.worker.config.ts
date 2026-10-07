import { defineConfig } from "vite";
import { resolve } from "node:path";

// The service worker is a script of its own, registered by address rather than loaded by the page: a build of its own, after the
// main one, as the boot script's is.
export default defineConfig({
    build: {
        emptyOutDir: false,
        outDir: "dist",
        lib: {
            entry: resolve(__dirname, "src/worker.ts"),
            formats: ["iife"],
            name: "NEStandardUIWorker",
            fileName: () => "ui-worker.js"
        }
    }
});
