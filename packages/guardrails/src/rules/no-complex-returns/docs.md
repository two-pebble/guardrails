# no-complex-returns

Return types must use simple named types, not inline unions, intersections, tuples, arrays, object literals, or function signatures.

## Bad

```typescript
function getConfig(): { name: string; value: number } {
  return { name: 'a', value: 1 };
}

function getResult(): string | null {
  return null;
}
```

## Good

```typescript
function getConfig(): Config {
  return { name: 'a', value: 1 };
}

function getResult(): Result {
  return null;
}
```

## Why

Inline complex return types clutter function signatures and cannot be reused. Extracting them into named type aliases improves readability and consistency.
