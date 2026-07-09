# useUpdater

Static asset update detection hook.

## What It Does

- Periodically fetches an HTML entry file.
- Parses script tags from the fetched HTML.
- Compares the initial script list with the latest script list.
- Calls registered callbacks when an update is detected or when there is no update.

This is useful for deployed single-page apps that need to notify users when a new build is available.

## Dependency

No extra dependency is required.

## Usage

```ts
import { useUpdater } from 'cz-hooks/useUpdater';

const [onNoUpdate, onUpdate] = useUpdater(10_000, '/');

onNoUpdate(() => {
  console.log('no update');
});

onUpdate(() => {
  console.log('new version available');
});
```

The first argument is the polling interval in milliseconds. The second argument is the HTML path to fetch.
