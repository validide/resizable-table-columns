import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import { pointerDoubleClick, pointerDrag } from "./tests/browser/support/commands.ts";

// Browser engines for the "browser" test project, e.g. BROWSER_TEST_ENGINES=chromium,firefox,webkit.
// Coverage (v8) is only collected in Chromium, so run other engines without --coverage.
type Engine = "chromium" | "firefox" | "webkit";
const browserEngines = (process.env.BROWSER_TEST_ENGINES ?? "chromium")
  .split(",")
  .map((name) => name.trim())
  .filter((name): name is Engine => ["chromium", "firefox", "webkit"].includes(name));

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
    coverage: {
      provider: "v8",
      reporter: ["text", "lcovonly"],
      include: ["sources/ts/**"],
      exclude: ["**/*.d.ts"],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          include: ["tests/*.ts"],
        },
      },
      {
        // Real-browser tests for layout and input behaviour that jsdom cannot emulate.
        extends: true,
        test: {
          name: "browser",
          include: ["tests/browser/**/*.test.ts"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: browserEngines.map((browser) => ({ browser })),
            viewport: { width: 1000, height: 700 },
            commands: { pointerDrag, pointerDoubleClick },
          },
        },
      },
    ],
  },
});
