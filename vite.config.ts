import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const root = fileURLToPath(new URL('.', import.meta.url));

const entry = (path: string) => resolve(root, path);
const coreRoot = entry('core');

const hookEntries = Object.fromEntries(
  readdirSync(coreRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && /^use[A-Z]/.test(dirent.name))
    .filter((dirent) => existsSync(entry(`core/${dirent.name}/index.ts`)))
    .map((dirent) => [`${dirent.name}/index`, entry(`core/${dirent.name}/index.ts`)]),
);

const optionalEntries = {
  ...(existsSync(entry('core/useGeolocation/dd.ts'))
    ? { 'useGeolocation/dd': entry('core/useGeolocation/dd.ts') }
    : {}),
};

export default defineConfig({
  plugins: [
    dts({
      entryRoot: '.',
      outDir: 'dist',
      include: ['index.ts', 'core/use*/**/*.ts'],
    }),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        index: entry('index.ts'),
        ...hookEntries,
        ...optionalEntries,
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['vue', 'dingtalk-jsapi'],
      output: {
        exports: 'named',
      },
    },
    sourcemap: false,
  },
});
