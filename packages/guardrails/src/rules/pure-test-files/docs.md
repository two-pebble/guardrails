# pure-test-files

Test files must only contain imports and `describe(...)` blocks at the top level, and describe blocks must contain only `it(...)` calls.

## Bad

```typescript
// user.test.ts
const helper = (name: string) => ({ name });

describe('User', () => {
  const shared = helper('Alice');
  it('happy: has a name', () => {});
});
```

## Good

```typescript
// user.test.ts
import { buildUser } from './testing';

describe('User', () => {
  it('happy: has a name', () => {});
});
```

## Why

Keeping test files declarative prevents shared mutable state and hidden setup. Helpers belong in dedicated testing utility modules.
