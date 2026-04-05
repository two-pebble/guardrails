# require-page-data-file

Every `page.tsx` must have a sidecar `data.ts` file that exports an async `loadPageData` function.

## Bad

```
src/app/settings/
  page.tsx          <-- no data.ts
```

```ts
// data.ts exists but missing loadPageData
export function getData() {
  return {};
}
```

## Good

```
src/app/settings/
  page.tsx
  data.ts
```

```ts
// data.ts
export async function loadPageData() {
  const { user } = await withAuth();
  return { user };
}
```

## Why

Separating server-side data loading into a sidecar file keeps page components focused on rendering and makes data dependencies explicit and testable.
