# it-name-prefixes

Every `it(...)` title must start with `happy: `, `unhappy: `, or `snapshot: `.

## Bad

```typescript
it('returns the correct value', () => {
  // ...
});
```

## Good

```typescript
it('happy: returns the correct value', () => {
  // ...
});
```

## Why

Standardized prefixes make it immediately clear whether a test covers success paths, failure paths, or snapshot verification.
