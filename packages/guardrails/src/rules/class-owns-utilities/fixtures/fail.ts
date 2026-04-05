const SOME_CONSTANT = 42;

function helper(): void {
  // helper
}

export class MyService {
  private name: string;

  constructor() {
    this.name = "test";
  }

  public run(): void {
    // uses helper
  }
}
