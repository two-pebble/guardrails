# no-satisfies-keyword

The TypeScript `satisfies` keyword is not allowed.

## Bad

```typescript
const config = {
  host: 'localhost',
  port: 3000,
} satisfies ServerConfig;
```

## Good

```typescript
const config: ServerConfig = {
  host: 'localhost',
  port: 3000,
};
```

## Why

`satisfies` validates a type without narrowing the variable, leading to subtle mismatches. An explicit type annotation provides a clearer contract.
