# max-indent-depth

Non-test TypeScript source must not indent beyond 8 levels.

## Bad

```typescript
function process(items: Item[]) {
  for (const item of items) {
    if (item.valid) {
      for (const child of item.children) {
        if (child.active) {
          for (const prop of child.props) {
            if (prop.enabled) {
              if (prop.visible) {
                if (prop.ready) {
                  handle(prop);
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## Good

```typescript
function process(items: Item[]) {
  for (const item of items) {
    if (!item.valid) continue;
    processChildren(item.children);
  }
}
```

## Why

Deep nesting makes code hard to follow. Flattening control flow with early returns or extracted helpers improves readability.
