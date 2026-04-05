class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}

function doSomething() {
  throw new AppError("something went wrong");
}
