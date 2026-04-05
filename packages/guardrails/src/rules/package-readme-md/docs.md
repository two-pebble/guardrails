## What It Checks

Requires every package to ship a sidecar `README.md` next to its `package.json`.

## Why It Exists

This keeps each package self-describing and ensures published packages always include a minimal intent and usage guide.

## Passing Pattern

````md
# Package Name

## Intent

Describe what the package is for.

## Examples

```bash
pnpm run guard
```
````

## Failing Pattern

```md
# Package Name

## Overview

Missing the required Intent and Examples sections.
```
