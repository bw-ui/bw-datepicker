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
  console.log('📦 Building @bw-ui/datepicker-mobile...');
  if (!existsSync('dist')) mkdirSync('dist');
  await esbuild.build({
    entryPoints: ['src/plugin.js'],
    outfile: 'dist/bw-mobile.min.js',
    bundle: true,
    minify: true,
    sourcemap: false,
    format: 'iife',
    globalName: 'BWMobile',
    platform: 'browser',
    target: ['es2020'],
  });
  await esbuild.build({
    entryPoints: ['src/plugin.js'],
    outfile: 'dist/bw-mobile.esm.min.js',
    bundle: true,
    minify: true,
    sourcemap: false,
    format: 'esm',
    platform: 'browser',
    target: ['es2020'],
  });
  try {
    writeFileSync(
      'dist/bw-mobile.min.css',
      minifyCSS(readFileSync('src/bw-mobile.css', 'utf8'))
    );
  } catch (e) {}
  console.log('✅ Mobile build complete!');
}
build().catch(console.error);
