#!/usr/bin/env -S deno run --allow-env=HOME,DENO_AUTH_TOKENS,DENO_DIR --allow-read --allow-write=./dist
import { bundle } from "https://deno.land/x/emit@0.32.0/mod.ts";
import { ensureDir } from "https://deno.land/std@0.209.0/fs/ensure_dir.ts";

const bundled = await bundle(
  new URL("./cache.ts", import.meta.url),
  { minify: true },
);

ensureDir("./dist");
await Deno.writeTextFile("./dist/cache.js", bundled.code, {
  mode: 0o744,
});
