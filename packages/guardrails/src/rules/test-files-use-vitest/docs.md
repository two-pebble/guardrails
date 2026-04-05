# test-files-use-vitest

Test files must use Vitest instead of Node built-in testing modules.

## Bad

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
```

## Good

```typescript
import { describe, it, expect } from 'vitest';
```

## Why

Standardizing on Vitest ensures consistent test APIs, assertion styles, and runner behavior across the entire codebase.
