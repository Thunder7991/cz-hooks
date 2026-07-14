import assert from 'node:assert/strict';
import { ref } from 'vue';

class FakeElement {
  scrollTop = 0;
  clientHeight = 0;
  scrollHeight = 0;

  addEventListener() {}

  removeEventListener() {}
}

Object.assign(globalThis, {
  HTMLElement: FakeElement,
});

let nextFrame;
let frameId = 0;

Object.assign(globalThis, {
  window: {
    requestAnimationFrame(callback) {
      nextFrame = callback;
      return ++frameId;
    },
    cancelAnimationFrame() {},
  },
});

const { useElAutoScroll } = await import('../dist/useElAutoScroll/index.js');

const originalWarn = console.warn;
console.warn = (...args) => {
  const message = String(args[0] ?? '');

  if (message.includes('onMounted is called when there is no active component instance')
    || message.includes('onUnmounted is called when there is no active component instance')) {
    return;
  }

  originalWarn(...args);
};

function runNextFrame() {
  const callback = nextFrame;
  nextFrame = undefined;
  assert.ok(callback, 'expected an animation frame to be scheduled');
  callback(0);
}

const wrap = new FakeElement();
const content = new FakeElement();
wrap.clientHeight = 100;
wrap.scrollTop = 200;
content.scrollHeight = 300;

let reachBottomCalls = 0;
const scrollbar = {
  wrapRef: wrap,
  setScrollTop(value) {
    wrap.scrollTop = value;
  },
};

const autoScroll = useElAutoScroll(ref(scrollbar), ref(content), {
  immediate: false,
  onReachBottom() {
    reachBottomCalls += 1;
  },
});

autoScroll.start();
runNextFrame();

assert.equal(reachBottomCalls, 1);
assert.equal(wrap.scrollTop, 0);

console.warn = originalWarn;
