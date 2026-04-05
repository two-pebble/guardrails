# require-component-story

Every `.tsx` component file must have a corresponding `.story.tsx` file.

## Bad

```
src/
  button.tsx          <-- no button.story.tsx
```

## Good

```
src/
  button.tsx
  button.story.tsx
```

## Why

Story files provide visual documentation and a development sandbox for each component, ensuring every component is rendered and reviewed in isolation.
