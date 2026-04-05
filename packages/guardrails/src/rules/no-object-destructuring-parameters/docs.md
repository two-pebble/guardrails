# no-object-destructuring-parameters

Function and class parameters must not use object destructuring.

## Bad

```typescript
function greet({ name, age }: UserInfo) {
  return `${name} is ${age}`;
}
```

## Good

```typescript
function greet(user: UserInfo) {
  return `${user.name} is ${user.age}`;
}
```

## Why

Destructured parameters hide the source object, making it harder to trace data flow. Accepting a named parameter and reading fields inside is more explicit.
