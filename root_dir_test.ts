import { assert } from "https://deno.land/std@0.196.0/assert/assert.ts";
import { add } from "./root_dir.ts";

Deno.test("add test 1", () => {
  assert(add(2, 2) === 5);
});
