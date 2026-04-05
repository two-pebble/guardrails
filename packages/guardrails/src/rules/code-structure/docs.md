# code-structure

Enforces that directories matching a pattern contain all required files or folders.

## Bad

A rule directory missing a required file:

```
src/rules/my-rule/
  rule.ts
  # missing: rule.test.ts, example.md, fixtures/
```

## Good

A rule directory with all required files:

```
src/rules/my-rule/
  rule.ts
  rule.test.ts
  example.md
  fixtures/
```

## Why

Consistent directory structure makes the codebase predictable. Every module of the same kind should have the same set of files.
