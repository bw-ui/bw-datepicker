import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const minifyCSS = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();

async function build() {
  console.log('📦 Building @bw-ui/datepicker...');

  if (!existsSync('dist')) mkdirSync('dist');

  // IIFE (for <script> tag)
  await esbuild.build({
    entryPoints: ['src/index.js'],
    outfile: 'dist/bw-datepicker.min.js',
    bundle: true,
    minify: true,
    sourcemap: false,
    format: 'iife',
    globalName: 'BW',
    platform: 'browser',
    target: ['es2020'],
  });

  // ESM (for import)
  await esbuild.build({
    entryPoints: ['src/index.js'],
    outfile: 'dist/bw-datepicker.esm.min.js',
    bundle: true,
    minify: true,
    sourcemap: false,
    format: 'esm',
    platform: 'browser',
    target: ['es2020'],
  });

  // CSS
  const css = readFileSync('src/bw-core.css', 'utf8');
  writeFileSync('dist/bw-datepicker.min.css', minifyCSS(css));

  console.log('✅ Core build complete!');
}

build().catch(console.error);
