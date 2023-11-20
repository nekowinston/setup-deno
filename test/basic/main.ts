#!/usr/bin/env -S deno run -A
// just get any stdlib for the cache test
import { red, yellow, green, cyan, magenta } from "std/fmt/colors.ts";

const helloWorld = [
  red("He"),
  yellow("llo"),
  " ",
  green("Wo"),
  cyan("rl"),
  magenta("d!"),
].join("");

console.log(helloWorld);
