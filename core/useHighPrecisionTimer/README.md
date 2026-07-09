# useHighPrecisionTimer

High precision countdown timer hook for Vue 3.

## What It Does

- Creates a countdown based on `performance.now()` and `requestAnimationFrame`.
- Exposes `remaining` and `isRunning` as Vue refs.
- Provides `start`, `pause`, and `reset` controls.
- Automatically pauses the timer when the component is unmounted.

## Dependency

No extra dependency is required except Vue.

```bash
npm install vue
```

## Usage

```ts
import { useHighPrecisionTimer } from 'cz-hooks/useHighPrecisionTimer';

const {
  remaining,
  isRunning,
  start,
  pause,
  reset,
} = useHighPrecisionTimer({
  duration: 10_000,
  onUpdate: (ms) => {
    console.log(ms);
  },
  onEnd: () => {
    console.log('done');
  },
});
```

`duration` is measured in milliseconds.
