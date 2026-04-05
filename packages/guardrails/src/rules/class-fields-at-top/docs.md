# class-fields-at-top

Class fields must be declared before constructors and methods, with no blank lines between them.

## Bad

```typescript
class UserService {
  public getName() { return this.name; }
  private name: string;
  private age: number;
}
```

## Good

```typescript
class UserService {
  private name: string;
  private age: number;

  public getName() { return this.name; }
}
```

## Why

Grouping all fields at the top of the class lets readers quickly inventory class state without scanning the entire body.
