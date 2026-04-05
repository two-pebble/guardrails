# story-title-matches-path

The Storybook `title` in a `.story.tsx` file must match the ancestor folder hierarchy.

## Bad

```
src/components/general/button/button.story.tsx
  title: 'Input/Button'        <-- folder is "general", not "input"
```

## Good

```
src/components/input/button/button.story.tsx
  title: 'Input/Button'        <-- "button" folder inside "input" folder
```

## Why

Keeps the file tree and Storybook sidebar in sync so components can be found by either path.
