## What It Checks

Requires the package root `package.json` to define a configured list of script names.

## Why It Exists

This keeps package entrypoints predictable so every package exposes the scripts your tooling expects.

## Config

```json
{
  "additional": {
    "@rule/required-scripts": {
      "requiredScripts": ["build", "test", "typecheck"]
    }
  }
}
```

## Passing Pattern

```json
{
  "scripts": {
    "build": "tsc --project tsconfig.build.json",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

## Failing Pattern

```json
{
  "scripts": {
    "build": "tsc --project tsconfig.build.json"
  }
}
```
