// This index.ts should FAIL — contains a function
export { foo } from "./foo.js";

export function helper() {
  return true;
}
