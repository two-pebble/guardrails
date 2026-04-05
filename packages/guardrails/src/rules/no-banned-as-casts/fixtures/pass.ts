// This file should PASS the no-banned-as-casts rule
const x = "hello" as string;
const y = 42 as number;
const z = { name: "test" } as MyInterface;

interface MyInterface {
  name: string;
}
