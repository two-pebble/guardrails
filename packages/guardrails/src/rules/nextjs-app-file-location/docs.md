# nextjs-app-file-location

Files under `src/app` that are not Next.js route files must live inside a `components/` or `actions/` folder.

## Allowed route files (anywhere under src/app)

`page.tsx`, `layout.tsx`, `data.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx`

## Bad

```
src/app/settings/
  page.tsx
  data.ts
  theme-toggle.tsx      <-- not a route file, not in components/
```

## Good

```
src/app/settings/
  page.tsx
  data.ts
  components/
    theme-toggle.tsx
  actions/
    save-settings.ts
```

## Why

Separating route files from supporting code makes the app directory scannable at a glance and prevents route folders from becoming grab-bags of unrelated files.
