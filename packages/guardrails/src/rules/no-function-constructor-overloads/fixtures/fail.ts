// This file should FAIL the no-function-constructor-overloads rule
function greet(name: string): string;
function greet(name: string, greeting: string): string;
function greet(name: string, greeting?: string) {
  return `${greeting || "hello"} ${name}`;
}

class Widget {
  constructor(name: string);
  constructor(name: string, size: number);
  constructor(name: string, size?: number) {
    console.log(name, size);
  }
}
