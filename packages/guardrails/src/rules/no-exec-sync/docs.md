# no-exec-sync

`execSync` is banned. All shell execution must be async.

## Bad

```typescript
import { execSync } from 'node:child_process';

const output = execSync('ls -la').toString();
```

## Good

```typescript
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(exec);
const { stdout } = await run('ls -la');
```

## Why

Synchronous exec blocks the event loop and can cause performance issues and timeouts. Async exec keeps the process responsive.
