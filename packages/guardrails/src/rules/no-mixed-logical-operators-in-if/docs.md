# no-mixed-logical-operators-in-if

If statements must not mix `&&` and `||` in the same condition.

## Bad

```typescript
if (isAdmin && hasAccess || isOwner) {
  grant();
}
```

## Good

```typescript
const canAccess = isAdmin && hasAccess;
const isOwner = checkOwner();

if (canAccess || isOwner) {
  grant();
}
```

## Why

Mixed logical operators rely on precedence rules that are easy to misread. Named boolean intermediates make each sub-condition explicit.
