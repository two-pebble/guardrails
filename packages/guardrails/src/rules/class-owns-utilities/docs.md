# class-owns-utilities

Files that define a class must not also define top-level constants or functions.

## Bad

```typescript
const MAX_RETRIES = 3;

function validate(input: string) { return input.length > 0; }

export class Fetcher {}
```

## Good

```typescript
export class Fetcher {
  private readonly maxRetries = 3;

  private validate(input: string) { return input.length > 0; }
}
```

## Why

Keeping a class file focused on the class itself prevents loosely related helpers from accumulating alongside it. Supporting behavior belongs inside the class or in a separate module.
