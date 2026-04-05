# throw-package-errors

Throw statements must construct a custom error imported from the package's `errors.ts` file.

## Bad

```typescript
throw new Error('not found');
```

## Good

```typescript
import { NotFoundError } from './errors';

throw new NotFoundError('user not found');
```

## Why

Using package-specific errors gives each failure a typed identity, enabling callers to catch and handle specific error cases rather than parsing generic messages.
