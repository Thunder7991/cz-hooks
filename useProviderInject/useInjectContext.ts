/*
 * @Author: thunderchen
 * @Date: 2022-11-24 21:22:45
 * @LastEditTime: 2024-06-20 18:33:58
 * @email: 853524319@qq.com
 */

import {
  inject,
  unref,
  watch,
  Ref,
  reactive,
  InjectionKey,
  ref,
  shallowRef,
  isRef,
  isReactive,
  onUnmounted,
} from 'vue';

type RefType = 'ref' | 'reactive' | 'shallowRef';
type ContextState = Ref<any> | Record<string, any>;
type InjectedContext = Record<string, ContextState>;

const isObject = (value: unknown): value is Record<string, any> => {
  return value !== null && typeof value === 'object';
};

const createFunctions: Record<RefType, (value?: any) => ContextState> = {
  ref: (value: any = {}) => ref<any>(value),
  reactive: (value: any = {}) =>
    reactive<any>(Array.isArray(value) ? [...value] : isObject(value) ? { ...value } : {}),
  shallowRef: (value: any = {}) => shallowRef<any>(value),
};

const replaceReactiveState = (target: Record<string, any>, value: Record<string, any>) => {
  if (Array.isArray(target) && Array.isArray(value)) {
    target.splice(0, target.length, ...value);
    return;
  }
  Object.keys(target).forEach((key) => {
    delete target[key];
  });
  Object.assign(target, value);
};
// stateRef:需要注入的依赖[]
// 依赖key值 symbol
export function useInjectContext(
  PIkey: InjectionKey<InjectedContext>,
  stateRef: string[],
  refType?: RefType[],
) {
  if (!stateRef.length) {
    return [];
  }
  let temporaryData: any = [];
  let temporaryKey: any = [];
  let Refs: ContextState[] = [];
  const injectRefs = inject(PIkey);
  let i = 1;
  for (const item of stateRef) {
    if (injectRefs) {
      temporaryData.push(() => unref(injectRefs![item]));
      temporaryKey.push('nv' + i);
      const currentValue = unref(injectRefs[item]);
      const type = refType?.[i - 1] ?? 'ref';
      const contextRef = createFunctions[type](currentValue);
      i++;
      Refs.push(contextRef);
    }
  }
  watch(
    temporaryData,
    (values) => {
      //数据重组 key
      for (let i = 0; i < Refs.length; i++) {
        const target = Refs[i];
        const value = values[i];
        if (isRef(target)) {
          target.value = value;
          continue;
        }
        if (isReactive(target) && isObject(value)) {
          replaceReactiveState(target, value);
        }
      }
    },
    {
      deep: true,
      immediate: true,
    },
  );
  //数据销毁
  onUnmounted(() => {
    //TODO
    if (Refs && Refs.length) {
      Refs.forEach((item: any) => {
        if (isReactive(item)) {
          item = null;
        } else {
          item.value = null;
        }
      });
      Refs = [];
      temporaryData = [];
      temporaryKey = [];
    }
  });
  return Refs;
}
