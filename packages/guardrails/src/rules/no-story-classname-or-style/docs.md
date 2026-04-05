# no-story-classname-or-style

Story files must not use `className` or `style` JSX attributes.

## Bad

```typescript
// button.story.tsx
export const Primary = () => (
  <Button className="custom" style={{ margin: 8 }}>Click</Button>
);
```

## Good

```typescript
// button.story.tsx
export const Primary = () => (
  <Button variant="primary">Click</Button>
);
```

## Why

Stories should showcase the component's own API. Adding custom styles in stories masks how the component actually looks and behaves in production.
