/**
 * Build script for @bw-ui/datepicker-vue
 */

import * as esbuild from 'esbuild';
import vue from 'esbuild-plugin-vue3';

// ESM build
await esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: 'dist/bw-vue.esm.min.js',
  external: ['vue', '@bw-ui/datepicker'],
  plugins: [vue()],
  target: ['es2020'],
});

// CJS build
await esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  format: 'cjs',
  outfile: 'dist/bw-vue.min.js',
  external: ['vue', '@bw-ui/datepicker'],
  plugins: [vue()],
  target: ['es2020'],
});

console.log('✓ Vue build complete');
