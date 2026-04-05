# pure-contract-files

`types.ts` files must contain only imports, exports, interfaces, and type aliases.

## Bad

```typescript
// types.ts
export interface User { name: string; }

export const DEFAULT_NAME = 'Anonymous';
```

## Good

```typescript
// types.ts
export interface User { name: string; }
export type UserId = string;
```

## Why

Keeping contract files purely declarative ensures they carry no runtime behavior, making them safe to import anywhere without side effects.
