import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const minifyCSS = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').replace(/;}/g, '}').trim();

async function build() {
  console.log('📦 Building @bw-ui/datepicker-accessibility...');
  if (!existsSync('dist')) mkdirSync('dist');

  await esbuild.build({
    entryPoints: ['src/plugin.js'],
    outfile: 'dist/bw-accessibility.min.js',
    bundle: true, minify: true, sourcemap: true,
    format: 'iife', globalName: 'BWAccessibility', platform: 'browser', target: ['es2020'],
  });

  await esbuild.build({
    entryPoints: ['src/plugin.js'],
    outfile: 'dist/bw-accessibility.esm.min.js',
    bundle: true, minify: true, sourcemap: true,
    format: 'esm', platform: 'browser', target: ['es2020'],
  });

  try {
    const css = readFileSync('src/bw-accessibility.css', 'utf8');
    writeFileSync('dist/bw-accessibility.min.css', minifyCSS(css));
  } catch (e) {}

  console.log('✅ Accessibility build complete!');
}

build().catch(console.error);
