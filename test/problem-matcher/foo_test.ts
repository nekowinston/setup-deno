import { assert } from "https://deno.land/std@0.196.0/assert/assert.ts";
import { add } from "./foo.ts";

Deno.test("add test 1", () => {
  assert(add(2, 2) === 5);
});

Deno.test("add test 2", () => {
  assert(add(2, 2) !== 4);
});
