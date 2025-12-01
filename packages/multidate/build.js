import * as esbuild from 'esbuild';
import fs from 'fs';

// Build ESM
await esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: 'dist/bw-multidate.esm.min.js',
});

// Build IIFE (for script tags)
await esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'BWMultiDate',
  outfile: 'dist/bw-multidate.min.js',
});

// Copy and minify CSS
const css = fs.readFileSync('src/bw-multidate.css', 'utf8');
const minifiedCss = css
  .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
  .replace(/\s+/g, ' ') // Collapse whitespace
  .replace(/\s*([{}:;,])\s*/g, '$1') // Remove space around syntax
  .replace(/;}/g, '}') // Remove last semicolon
  .trim();

fs.writeFileSync('dist/bw-multidate.min.css', minifiedCss);

console.log('✅ Build complete!');
console.log('   dist/bw-multidate.esm.min.js');
console.log('   dist/bw-multidate.min.js');
console.log('   dist/bw-multidate.min.css');
