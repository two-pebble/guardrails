interface Person {
  name: string;
  age: number;
}

function greet(person: Person) {
  return `${person.name} is ${person.age}`;
}

const process = (id: string) => id;
