import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ESM build
await esbuild.build({
  entryPoints: [resolve(__dirname, 'src/index.js')],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: resolve(__dirname, 'dist/bw-dual-calendar.esm.min.js'),
  target: ['es2020'],
});

// IIFE build
await esbuild.build({
  entryPoints: [resolve(__dirname, 'src/index.js')],
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'BWDualCalendar',
  outfile: resolve(__dirname, 'dist/bw-dual-calendar.min.js'),
  target: ['es2020'],
});

// CSS minification
const css = readFileSync(
  resolve(__dirname, 'src/bw-dual-calendar.css'),
  'utf-8'
);
const { code: minifiedCss } = await esbuild.transform(css, {
  loader: 'css',
  minify: true,
});
writeFileSync(resolve(__dirname, 'dist/bw-dual-calendar.min.css'), minifiedCss);

console.log('✓ Dual Calendar plugin build complete');
