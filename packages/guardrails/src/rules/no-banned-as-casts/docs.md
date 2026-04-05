# no-banned-as-casts

Type assertions using `as any`, `as unknown`, or `as never` are not allowed.

## Bad

```typescript
const value = getData() as any;
const result = input as unknown;
```

## Good

```typescript
const value: Data = getData();
const result = narrowInput(input);
```

## Why

Casting to `any`, `unknown`, or `never` defeats the type system. Proper narrowing or explicit types preserve type safety.
