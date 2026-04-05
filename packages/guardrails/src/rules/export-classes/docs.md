# export-classes

Classes must be exported directly from the module at the top level.

## Bad

```typescript
class UserService {}

function createService() {
  class InnerService {}
  return InnerService;
}
```

## Good

```typescript
export class UserService {}
```

## Why

Unexported or nested classes are hidden from the module boundary. Exporting them at the top level keeps the module's API explicit and discoverable.
