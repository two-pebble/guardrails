# no-complex-parameters

Parameter types must use simple named types, not inline unions, intersections, tuples, arrays, object literals, or function signatures.

## Bad

```typescript
function send(target: { host: string; port: number }) {
  // ...
}

function run(executor: (name: string) => Promise<string>) {
  // ...
}
```

## Good

```typescript
function send(target: ConnectionTarget) {
  // ...
}

function run(executor: CommandExecutor) {
  // ...
}
```

## Why

Inline complex types clutter function signatures and cannot be reused. Extracting them into named type aliases improves readability and consistency.
