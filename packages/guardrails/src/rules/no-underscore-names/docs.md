# no-underscore-names

Variable and class names must not contain underscores.

## Bad

```typescript
const user_name = 'Alice';
class My_Service {}
```

## Good

```typescript
const userName = 'Alice';
class MyService {}
```

## Why

Underscores conflict with the camelCase and PascalCase conventions used throughout TypeScript codebases. Consistent naming reduces cognitive overhead.
