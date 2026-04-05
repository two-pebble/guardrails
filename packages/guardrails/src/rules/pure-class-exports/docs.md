# pure-class-exports

Files that export a class must export only that class.

## Bad

```typescript
export class UserService {}

export const DEFAULT_TIMEOUT = 5000;
```

## Good

```typescript
export class UserService {}
```

## Why

A single-export constraint keeps class files focused. Auxiliary exports belong in their own modules so each file has one clear responsibility.
