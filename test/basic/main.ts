#!/usr/bin/env -S deno run
// just get any stdlib for the cache test
import { cyan, green, magenta, red, yellow } from "std/fmt/colors.ts";

const rainbowify = (str: string) =>
  str
    .split("")
    .map((char, index) => [red, yellow, green, cyan, magenta][index % 5](char))
    .join("");

console.log(rainbowify("Hello World!"));
