/**
 * Build script for @bw-ui/datepicker-range
 */

import * as esbuild from 'esbuild';

// ESM build
await esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: 'dist/bw-range.esm.min.js',
  external: ['@bw-ui/datepicker'],
  target: ['es2020'],
});

// IIFE build
await esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'BWRange',
  outfile: 'dist/bw-range.min.js',
  external: ['@bw-ui/datepicker'],
  target: ['es2020'],
});

// CSS build
await esbuild.build({
  entryPoints: ['src/bw-range.css'],
  bundle: true,
  minify: true,
  outfile: 'dist/bw-range.min.css',
});

console.log('✓ Range plugin build complete');
