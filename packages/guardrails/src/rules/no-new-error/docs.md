# no-new-error

Do not instantiate the built-in `Error` class directly.

## Bad

```typescript
throw new Error('something went wrong');
```

## Good

```typescript
import { ValidationError } from './errors';

throw new ValidationError('invalid input');
```

## Why

Generic errors lack context and type information. Custom error classes enable structured error handling and make catch blocks meaningful.
