#!/usr/bin/env -S deno run
// just get any stdlib for the cache test
import { cyan, green, magenta, red, yellow } from "std/fmt/colors.ts";

const helloWorld = [
  red("He"),
  yellow("llo"),
  " ",
  green("Wo"),
  cyan("rl"),
  magenta("d!"),
].join("");

console.log(helloWorld);
