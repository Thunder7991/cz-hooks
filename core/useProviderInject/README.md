# useProviderInject

Provider/inject helpers for Vue 3 composition state.

## What It Does

- `useProviderContext` creates a shared reactive context with `provide`.
- `useInjectContext` reads selected fields from that context with `inject`.
- It supports `ref`, `shallowRef`, and `reactive` style state.
- It is useful when a group of nested components need shared state without introducing a global store.

## Dependency

No extra dependency is required except Vue.

```bash
npm install vue
```

## Usage

```ts
import { useProviderContext, useInjectContext } from 'cz-hooks/useProviderInject';
```

Use the same `InjectionKey` for provider and consumer components.

```ts
import type { InjectionKey, Ref } from 'vue';

const key = Symbol('form-context') as InjectionKey<Record<string, Ref<any>>>;

const [setData, getData] = useProviderContext(key, [
  { key: 'count', value: 0, type: 'ref' },
  { key: 'form', value: { name: '' }, type: 'reactive' },
])!;

const [count, form] = useInjectContext(key, ['count', 'form'], ['ref', 'reactive']);
```
