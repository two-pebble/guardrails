# single-tsx-export

TSX files must define at most one top-level function.

## Bad

```tsx
function Header() {
  return <header>Header</header>;
}

export default function Page() {
  return <div><Header /></div>;
}
```

## Good

```tsx
// header.tsx
export function Header() {
  return <header>Header</header>;
}

// page.tsx
import { Header } from './header';

export default function Page() {
  return <div><Header /></div>;
}
```

## Why

One function per file keeps components focused, discoverable, and independently testable.
