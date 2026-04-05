# no-custom-style

TSX files must not use `className` or `style` attributes.

## Bad

```typescript
function Banner() {
  return <div className="hero" style={{ color: 'red' }}>Hello</div>;
}
```

## Good

```typescript
function Banner() {
  return <Card variant="hero">Hello</Card>;
}
```

## Why

Direct styling bypasses the component library's design system. Using the component API ensures visual consistency and centralizes theming.
