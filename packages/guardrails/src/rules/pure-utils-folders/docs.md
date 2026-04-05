# pure-utils-folders

Utils folders must be flat (no subdirectories), contain only TypeScript files, and each file must export exactly one function.

## Bad

```typescript
// utils/helpers.ts
export function formatDate(d: Date) { return d.toISOString(); }
export function formatName(n: string) { return n.trim(); }
```

## Good

```typescript
// utils/format-date.ts
export function formatDate(d: Date) { return d.toISOString(); }

// utils/format-name.ts
export function formatName(n: string) { return n.trim(); }
```

## Why

Single-function utility files are easy to find, import, and test. Keeping the folder flat prevents utils from growing into a hidden sub-package.
