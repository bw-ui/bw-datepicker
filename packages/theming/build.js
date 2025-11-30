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
  console.log('ðŸ“¦ Building @bw-ui/datepicker-theming...');
  if (!existsSync('dist')) mkdirSync('dist');

  await esbuild.build({
    entryPoints: ['src/plugin.js'],
    outfile: 'dist/bw-theming.min.js',
    bundle: true,
    minify: true,
    sourcemap: false,
    format: 'iife',
    globalName: 'BWTheming',
    platform: 'browser',
    target: ['es2020'],
  });

  await esbuild.build({
    entryPoints: ['src/plugin.js'],
    outfile: 'dist/bw-theming.esm.min.js',
    bundle: true,
    minify: true,
    sourcemap: false,
    format: 'esm',
    platform: 'browser',
    target: ['es2020'],
  });

  const css = readFileSync('src/bw-themes.css', 'utf8');
  writeFileSync('dist/bw-theming.min.css', minifyCSS(css));

  console.log('âœ… Theming build complete!');
}

build().catch(console.error);
