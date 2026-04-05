# require-public-method-comments

All public class methods must have a comment above them.

## Bad

```ts
export class Service {
  public start() {
    return true;
  }
}
```

## Good

```ts
export class Service {
  // Starts the service
  public start() {
    return true;
  }
}
```

## Why

Public methods are the API surface of a class. A comment helps readers understand the intent without reading the implementation.
