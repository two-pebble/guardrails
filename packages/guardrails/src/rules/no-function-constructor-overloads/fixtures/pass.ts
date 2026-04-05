// This file should PASS the no-function-constructor-overloads rule
function greet(name: string) {
  return `hello ${name}`;
}

function farewell(name: string) {
  return `goodbye ${name}`;
}

class Widget {
  constructor(name: string) {
    console.log(name);
  }
}
