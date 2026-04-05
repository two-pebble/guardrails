import { AppError } from "./errors.js";

export function doSomething() {
  throw new AppError("Something went wrong");
}
