import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
  target: 'es2022',
  outDir: 'dist'
});
