## What It Checks

Requires TypeScript file and folder names to stay lowercase and use hyphens instead of underscores.

## Why It Exists

Consistent path naming makes imports more predictable and prevents casing drift across platforms.

## Passing Pattern

```text
src/rules/no-dynamic-imports/rule.ts
```

## Failing Pattern

```text
src/Bad_Folder/BadFile.ts
```

