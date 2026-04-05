# no-custom-colors

TSX component files must not use hardcoded colors. Use theme tokens instead.

## Bad

```tsx
<div style={{ color: '#ff0000' }}>Error</div>
<div className="text-red-500">Error</div>
<div style={{ background: 'white' }}>Card</div>
```

## Good

```tsx
<div className="text-danger">Error</div>
<div className="bg-surface text-content">Card</div>
<div className="text-accent">Link</div>
```

## Why

Hardcoded colors break dark mode and diverge from the design system. Theme tokens ensure consistency and automatic light/dark support.
