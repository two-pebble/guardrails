class MyService {
  public run(): void {
    // not exported
  }
}

const factory = class InlineClass {
  public go(): void {
    // class expression
  }
};
