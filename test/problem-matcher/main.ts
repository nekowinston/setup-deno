import * as
 color from "https://deno.land/std@0.207.0/fmt/colors.ts";

console.log(green("Hello world!"));

for (const [name, value] of Object.entries()) {
  console.log(name, value);
}

let x
 = 42;

let y: any = {};

// intentionally broken sytax to check the problem matcher
