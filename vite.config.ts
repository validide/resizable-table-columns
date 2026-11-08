import { defineConfig } from "vitest/config";

export default defineConfig({
  publicDir: false,
  server: {
    open: true,
  },
  build: {
    lib: {
      entry: "./sources/ts/index.ts",
      formats: ["es", "cjs", "umd"],
      name: "validide_resizableTableColumns",
      fileName: (format) => {
        if (format === "es") return "index.js";
        if (format === "cjs") return "index.cjs";
        if (format === "umd") return "index.umd.cjs";
        return `index.${format}.js`;
      },
    },
    outDir: "./dist/bundle",
    sourcemap: true,
    minify: true,
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/**/*.ts", "tests/**/*.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcovonly"],
      include: ["sources/ts/**"],
      exclude: ["**/*.d.ts"],
    },
  },
});
