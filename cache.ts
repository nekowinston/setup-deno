#!/usr/bin/env -S deno run --no-lock --allow-read --allow-run=deno --allow-env=CI,DENO_DIR
import { parseArgs } from "https://deno.land/std@0.210.0/cli/parse_args.ts";
import { encodeHex } from "https://deno.land/std@0.210.0/encoding/hex.ts";
import { exists, walk } from "https://deno.land/std@0.210.0/fs/mod.ts";
import * as JSONC from "https://deno.land/std@0.210.0/jsonc/parse.ts";
import * as log from "https://deno.land/std@0.210.0/log/mod.ts";
import { relative } from "https://deno.land/std@0.210.0/path/relative.ts";
import ignore from "https://esm.sh/gh/nekowinston/deno-ignore@v5.3.0/index.js?pin=v135";
type DenoConfig = {
  cache: { include?: string[]; exclude?: string[] };
  exclude?: string[];
  [key: string]: unknown;
};

if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    boolean: ["dry-run", "verbose", "lock-write"],
    negatable: ["lock-write"],
    string: ["config"],
    default: { "lock-write": true },
    alias: { "dry-run": "n", verbose: "v" },
    "--": true,
    unknown: (arg) => {
      console.log(`Unknown argument: ${arg}`);
      console.log(
        "Usage: cache [-n | --dry-run] [-v | --verbose] [--] [DENO_ARGS...]",
      );
      Deno.exit(0);
    },
  });
  const denoDir = Deno.env.get("DENO_DIR");

  const logLevel = ["1", "true"].includes(Deno.env.get("CI") ?? "")
    ? "DEBUG"
    : (args.verbose ? "DEBUG" : "INFO");
  log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler(logLevel, {
        formatter: (logRecord) =>
          Deno.noColor
            ? logRecord.levelName + " " + logRecord.msg
            : logRecord.msg,
      }),
    },
    loggers: { default: { handlers: ["console"], "level": logLevel } },
  });

  if (args["dry-run"]) log.warning("dry-run mode enabled");
  if (args.config && !await exists(args.config)) {
    log.error(`config file ${args.config} not found`);
    Deno.exit(1);
  }

  // the two-step hash is intentional
  const hash = await Deno.readFile("./deno.lock")
    .then((data) => crypto.subtle.digest("SHA-256", data))
    .then((data) => crypto.subtle.digest("SHA-256", data))
    .then((data) => encodeHex(new Uint8Array(data)))
    .catch((_) => "<no deno.lock found>");
  log.debug(`GitHub actions deno.lock hash: ${hash}`);

  // Deno implementation: `json` takes precedence over `jsonc`
  const cfgs = args.config ? [args.config] : ["deno.json", "deno.jsonc"];
  const denoCfg = await Promise.all(
    cfgs.map((path) => Deno.readTextFile(path).catch((_) => undefined)),
  ).then((v) => JSONC.parse(v.filter(Boolean)[0] ?? "{}")) as DenoConfig;

  // flattening so that a single string doesn't break too much
  const patterns = [
    ...[denoCfg?.exclude ?? []].flat(),
    ...[denoCfg?.cache?.exclude ?? []].flat(),
    ...[denoCfg?.cache?.include ?? []].flatMap((p) => `!${p}`),
  ];
  log.debug(`patterns:`, patterns);
  patterns.forEach((p) => log.debug(`- ${p}`));
  const ig = ignore().add(patterns);

  const walkIterator = walk(".", {
    exts: ["js", ".jsx", ".ts", ".tsx"],
    includeDirs: false,
  });

  const paths = [];

  for await (const entry of walkIterator) {
    const relativePath = relative(".", entry.path);

    // assuming that DENO_DIR is set inside the current directory,
    // this would first fetch the deps of this script, store them there,
    // then include them here. since the cache could be huge, don't log it.
    if (denoDir && entry.path.startsWith(denoDir)) continue;
    if (ig.ignores(relativePath)) {
      log.debug(`ignored ${relativePath}`);
      continue;
    }

    log.debug(`caching ${relativePath}`);
    paths.push(relativePath);
  }

  const denoArgs = [
    "cache",
    args["lock-write"] && "--lock-write",
    args.config && `--config=${args.config}`,
    ...args["--"], // everything after `--` is passed to Deno
    ...paths,
  ].filter(Boolean) as string[];
  const cmd = new Deno.Command(Deno.execPath(), { args: denoArgs });
  const cmdString = Deno.execPath() + " " + denoArgs.join(" ");

  if (args["dry-run"]) {
    log.info(`would run: ${cmdString}`);
    Deno.exit(0);
  }
  log.debug(`running: ${cmdString}`);
  const { stderr, code } = await cmd.output();

  // deno cache outputs to stderr
  for (const line of new TextDecoder().decode(stderr).split("\n")) {
    if (line.length > 0) log.info("deno> " + line);
  }

  if (code === 0) log.debug(`finished caching ${paths.length} files`);
}
