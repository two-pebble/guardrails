# class-file-name-matches-class

Files that define a top-level class must use the kebab-case form of the class name as the filename.

## Bad

```typescript
// file: userService.ts
export class UserService {}
```

## Good

```typescript
// file: user-service.ts
export class UserService {}
```

## Why

Consistent file naming makes it easy to locate a class by name without guessing capitalization or separator conventions.
