import { bar } from "./bar.ts";
// This file should FAIL the no-import-target-extensions rule
import { foo } from "./foo.js";

export { baz } from "./baz.js";
