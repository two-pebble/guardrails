## What It Checks

Disallows the `.markdown` file extension and requires `.md` instead.

## Why It Exists

Using one markdown extension keeps rule sidecars and docs tooling predictable across the repository.

## Passing Pattern

```text
src/rules/no-dynamic-imports/docs.md
```

## Failing Pattern

```text
src/rules/no-dynamic-imports/docs.markdown
```
