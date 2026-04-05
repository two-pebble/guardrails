## What It Checks

Disallows dynamic `import()` calls and inline import type queries inside TypeScript source files.

## Why It Exists

This keeps module boundaries static and easier to reason about across the codebase.

## Passing Pattern

```ts
import { loadConfig } from "./load-config";

export async function runGuardrail() {
  return loadConfig();
}
```

## Failing Pattern

```ts
export async function runGuardrail() {
  return import("./load-config");
}
```

