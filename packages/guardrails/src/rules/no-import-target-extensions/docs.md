# no-import-target-extensions

Import and export specifiers must not end with `.js` or `.ts`.

## Bad

```typescript
import { Parser } from './parser.js';
export { Formatter } from './formatter.ts';
```

## Good

```typescript
import { Parser } from './parser';
export { Formatter } from './formatter';
```

## Why

Extensionless specifiers decouple source from build output and let the module resolver handle extension mapping consistently.
