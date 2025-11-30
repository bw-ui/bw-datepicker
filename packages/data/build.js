/**
 * Build script for @bw-ui/datepicker-data
 */

import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';

// ESM build
await esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: 'dist/bw-data.esm.min.js',
  external: ['@bw-ui/datepicker'],
  target: ['es2020'],
});

// IIFE build
await esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'BWData',
  outfile: 'dist/bw-data.min.js',
  external: ['@bw-ui/datepicker'],
  target: ['es2020'],
});

// CSS build
await esbuild.build({
  entryPoints: ['src/bw-data.css'],
  bundle: true,
  minify: true,
  outfile: 'dist/bw-data.min.css',
});

console.log('✓ Data plugin build complete');
