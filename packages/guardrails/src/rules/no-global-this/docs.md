# no-global-this

Do not use `globalThis` to mutate or read globals.

## Bad

```ts
globalThis.WebSocket = MyWebSocket;
```

## Good

```ts
const client = new WsBridgeClient({ webSocketFactory: (url) => new MyWebSocket(url) });
```
