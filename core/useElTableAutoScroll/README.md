# useElTableAutoScroll

Auto scroll hook for Element Plus `el-table`.

## What It Does

- Finds the table body scroll wrapper from an Element Plus table instance or table root element.
- Reuses `useElAutoScroll` to scroll the table body with `requestAnimationFrame`.
- Resets to the top automatically when the table body reaches the bottom.
- Pauses while the user hovers over the table body by default.
- Exposes `refresh` for tables rendered after data, column, or layout changes.

## Advantages

- Works with Element Plus table component refs through `$el`.
- Does not import Element Plus directly, so Element Plus remains a peer project dependency only.
- Supports the same speed, hover pause, and immediate start options as `useElAutoScroll`.
- Keeps table auto-scroll behavior out of business components.

## Dependency

This hook is designed for projects that already use Element Plus `el-table`.

No extra package is required by `vue-hooks-cz`, but your application should install Element Plus when using this hook:

```bash
npm install element-plus
```

## Usage

```vue
<template>
  <el-table ref="TableRef" :data="rows" height="320">
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="status" label="Status" />
  </el-table>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import {
  useElTableAutoScroll,
  type ElTableAutoScrollTarget,
} from 'vue-hooks-cz/useElTableAutoScroll';

const TableRef = ref<ElTableAutoScrollTarget>();
const rows = ref([
  { name: 'Build', status: 'Running' },
  { name: 'Deploy', status: 'Queued' },
]);

const { start, stop, reset, refresh, isRunning, isHovering } = useElTableAutoScroll(
  TableRef,
  { speed: 0.2 },
);

watch(rows, async () => {
  await nextTick();
  refresh();
});
</script>
```

## Options

`useElTableAutoScroll` accepts the same options as `useElAutoScroll`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `speed` | `number` | `1` | Scroll distance added on every animation frame. Fractional values are supported. |
| `pauseOnHover` | `boolean` | `true` | Whether to pause while the user hovers over the table body. |
| `immediate` | `boolean` | `true` | Whether to start scrolling automatically after mount. |

## Return

| Field | Description |
| --- | --- |
| `isRunning` | Whether auto scrolling is currently running. |
| `isHovering` | Whether the user is hovering over the table body. |
| `start` | Starts auto scrolling. |
| `stop` | Stops auto scrolling and cancels the animation frame. |
| `reset` | Resets the table body scrollbar to the top. |
| `refresh` | Resolves the current table body wrapper and content again. Call this after layout or data changes when needed. |
