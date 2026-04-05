# no-object-assign

`Object.assign(...)` is not allowed.

## Bad

```typescript
const config = Object.assign({}, defaults, overrides);
```

## Good

```typescript
const config = { ...defaults, ...overrides };
```

## Why

`Object.assign` mutates its first argument and is less readable than spread syntax. Explicit object literals make the shape visible at the call site.
