function greet({ name, age }: { name: string; age: number }) {
  return `${name} is ${age}`;
}

const process = ({ id }: { id: string }) => id;
