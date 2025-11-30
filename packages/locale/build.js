import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// ESM build
esbuild.buildSync({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: 'dist/bw-locale.esm.min.js',
  target: ['es2020'],
});

// IIFE build
esbuild.buildSync({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'BWLocale',
  outfile: 'dist/bw-locale.min.js',
  target: ['es2020'],
});

console.log('✅ Build complete!');
console.log('   dist/bw-locale.esm.min.js');
console.log('   dist/bw-locale.min.js');
