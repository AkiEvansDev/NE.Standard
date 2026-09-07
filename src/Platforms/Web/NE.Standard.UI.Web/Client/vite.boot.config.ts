import { defineConfig } from "vite";
import { resolve } from "node:path";

// The boot script is a classic script, not a module: it runs in <head> before the body is parsed, which a
// module — deferred by definition — cannot. A build of its own, after the main one, because vite's library
// mode builds one format per run and the main bundle empties the output directory first.
export default defineConfig({
    build: {
        emptyOutDir: false,
        outDir: "dist",
        lib: {
            entry: resolve(__dirname, "src/boot.ts"),
            formats: ["iife"],
            name: "NEStandardUIBoot",
            fileName: () => "ui-boot.js"
        }
    }
});
