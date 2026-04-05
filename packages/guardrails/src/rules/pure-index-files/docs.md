# pure-index-files

`index.ts` files must contain only import and export declarations.

## Bad

```typescript
// index.ts
export { UserService } from './user-service';

const VERSION = '1.0.0';
```

## Good

```typescript
// index.ts
export { UserService } from './user-service';
export type { UserConfig } from './types';
```

## Why

Index files serve as aggregation boundaries. Adding logic or constants to them blurs the line between public API surface and implementation.
