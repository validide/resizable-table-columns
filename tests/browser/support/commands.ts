// Server-side (Node) browser commands: drive real mouse input through Playwright.
// Coordinates are client coordinates inside the test iframe; they are translated to page coordinates here.
// loads the Playwright fields (page, frame, iframe) of BrowserCommandContext
import type {} from "@vitest/browser-playwright";
import type { BrowserCommandContext } from "vitest/node";

export interface Point {
  x: number;
  y: number;
}

const frameOffset = async (ctx: BrowserCommandContext): Promise<Point> => {
  const frame = await ctx.frame();
  const box = await (await frame.frameElement()).boundingBox();
  return { x: box?.x ?? 0, y: box?.y ?? 0 };
};

/** Press the primary button at `from`, move to `to` in small steps, then release. */
export const pointerDrag = async (ctx: BrowserCommandContext, from: Point, to: Point, steps = 10): Promise<void> => {
  const offset = await frameOffset(ctx);
  const { mouse } = ctx.page;
  await mouse.move(offset.x + from.x, offset.y + from.y);
  await mouse.down();
  await mouse.move(offset.x + to.x, offset.y + to.y, { steps });
  // let the library's debounced pointermove handler run before releasing
  await ctx.page.waitForTimeout(50);
  await mouse.up();
};

/** Two clicks at `at`, `gap` ms apart (the library debounces pointer events within 100 ms). */
export const pointerDoubleClick = async (ctx: BrowserCommandContext, at: Point, gap = 150): Promise<void> => {
  const offset = await frameOffset(ctx);
  const { mouse } = ctx.page;
  await mouse.move(offset.x + at.x, offset.y + at.y);
  await mouse.down();
  await mouse.up();
  await ctx.page.waitForTimeout(gap);
  await mouse.down();
  await mouse.up();
};

declare module "vitest/browser" {
  interface BrowserCommands {
    pointerDrag: (from: Point, to: Point, steps?: number) => Promise<void>;
    pointerDoubleClick: (at: Point, gap?: number) => Promise<void>;
  }
}
