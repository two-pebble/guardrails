# package-errors-file

Each package's `src/errors.ts` must export at least one custom error class that extends Error.

## Bad

```typescript
// src/errors.ts
export const ERROR_CODE = 'INVALID';
```

## Good

```typescript
// src/errors.ts
export class ValidationError extends Error {
  public constructor(message: string) {
    super(message);
  }
}
```

## Why

A dedicated errors file gives each package a well-defined set of failure modes, making error handling consistent and discoverable across the codebase.
