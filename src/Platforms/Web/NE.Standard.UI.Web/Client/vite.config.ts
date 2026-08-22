import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
    build: {
        emptyOutDir: true,
        outDir: "dist",
        lib: {
            entry: resolve(__dirname, "src/ui.ts"),
            formats: ["es"],
            fileName: () => "ui.js",
            cssFileName: "ui"
        }
    }
});
