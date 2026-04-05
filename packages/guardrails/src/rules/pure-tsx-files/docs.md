# pure-tsx-files

TSX files must define and export only one top-level function.

## Bad

```typescript
// card.tsx
export function Card() { return <div />; }
export function CardHeader() { return <div />; }
```

## Good

```typescript
// card.tsx
export function Card() { return <div />; }
```

## Why

One component per file makes each module's purpose clear and ensures the file tree maps directly to the component hierarchy.
