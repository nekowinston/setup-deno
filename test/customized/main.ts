// just another script to test caching of multiple scripts:
/**
 * taken from
 * https://deno.land/x/cliffy@v1.0.0-rc.3/examples/command.ts
 */

import { Command } from "cliffy/command/mod.ts";

await new Command()
  .name("reverse-proxy")
  .description("A simple reverse proxy example cli.")
  .version("v1.0.0")
  .option("-p, --port <port:number>", "The port number for the local server.", {
    default: 8080,
  })
  .option("--host <hostname>", "The host name for the local server.", {
    default: "localhost",
  })
  .arguments("[domain]")
  .action(({ port, host }) => {
    console.log(`Listening on http://${host}:${port}`);
  })
  .parse();
