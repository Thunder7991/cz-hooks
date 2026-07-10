import { nextTick, onMounted, shallowRef, type Ref } from 'vue';
import {
  useElAutoScroll,
  type UseElAutoScrollOptions,
  type UseElAutoScrollReturn,
} from '../useElAutoScroll';

export type ElTableAutoScrollTarget = HTMLElement | {
  $el?: HTMLElement;
};

export type UseElTableAutoScrollOptions = UseElAutoScrollOptions;

export interface UseElTableAutoScrollReturn extends UseElAutoScrollReturn {
  refresh: () => void;
}

function resolveTableRoot(target?: ElTableAutoScrollTarget) {
  if (!target)
    return undefined;

  if (target instanceof HTMLElement)
    return target;

  return target.$el;
}

function getFirstElementChild(element: HTMLElement) {
  return element.firstElementChild instanceof HTMLElement ? element.firstElementChild : undefined;
}

function resolveTableScrollElements(root?: HTMLElement) {
  if (!root)
    return {};

  const wrap = root.querySelector<HTMLElement>('.el-scrollbar__wrap')
    ?? root.querySelector<HTMLElement>('.el-table__body-wrapper');
  const content = root.querySelector<HTMLElement>('.el-scrollbar__view')
    ?? root.querySelector<HTMLElement>('.el-table__body')
    ?? (wrap ? getFirstElementChild(wrap) : undefined);

  return {
    content,
    wrap,
  };
}

export function useElTableAutoScroll(
  tableRef: Ref<ElTableAutoScrollTarget | undefined>,
  options: UseElTableAutoScrollOptions = {},
): UseElTableAutoScrollReturn {
  const scrollbarRef = shallowRef<HTMLElement>();
  const contentRef = shallowRef<HTMLElement>();
  const autoScroll = useElAutoScroll(scrollbarRef, contentRef, options);

  function refresh() {
    const root = resolveTableRoot(tableRef.value);
    const { wrap, content } = resolveTableScrollElements(root);

    scrollbarRef.value = wrap;
    contentRef.value = content;
  }

  onMounted(() => {
    void nextTick(refresh);
  });

  return {
    ...autoScroll,
    refresh,
  };
}

export default useElTableAutoScroll;
