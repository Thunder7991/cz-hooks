# useGeolocation

Geolocation hooks for browser and DingTalk environments.

## What It Does

- `useGeolocation` reads the browser's native geolocation API.
- It stores loading/error state and current coordinates.
- It converts WGS84 coordinates to GCJ-02 coordinates for China map usage.
- `useDdGeolocation` reads location through DingTalk JSAPI and is published as an optional subpath.

## Browser geolocation

No extra dependency is required except Vue. Use this when the app runs in a normal browser environment.

```ts
import { useGeolocation } from 'vue-hooks-cz/useGeolocation';

const {
  loading,
  error,
  startPosition,
  getLocation,
  getLocationOnce,
} = useGeolocation();
```

## DingTalk geolocation

Use this when the app runs inside DingTalk and needs DingTalk JSAPI authorization before reading location.

The DingTalk hook is published as a separate subpath so regular users do not need to install the DingTalk SDK.

Install the peer dependency only when using this hook:

```bash
npm install dingtalk-jsapi
```

Then import it explicitly:

```ts
import { useDdGeolocation } from 'vue-hooks-cz/useDdGeolocation';

const location = useDdGeolocation({
  url: '/api/dingtalk/jsapi-signature',
});
```

Your signature endpoint should return the DingTalk JSAPI config consumed by `dd.config`.
