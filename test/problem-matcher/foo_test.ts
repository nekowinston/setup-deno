import { assert } from "@std/assert/assert";
import { add } from "./foo.ts";

Deno.test("add test 1", () => {
  assert(add(2, 2) === 5);
});

Deno.test("add test 2", () => {
  assert(add(2, 2) !== 4);
});
