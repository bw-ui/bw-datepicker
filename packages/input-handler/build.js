import * as esbuild from 'esbuild';
import { mkdirSync, existsSync } from 'fs';
async function build() {
  console.log('📦 Building @bw-ui/datepicker-input-handler...');
  if (!existsSync('dist')) mkdirSync('dist');
  await esbuild.build({
    entryPoints: ['src/plugin.js'],
    outfile: 'dist/bw-input-handler.min.js',
    bundle: true,
    minify: true,
    sourcemap: false,
    format: 'iife',
    globalName: 'BWInputHandler',
    platform: 'browser',
    target: ['es2020'],
  });
  await esbuild.build({
    entryPoints: ['src/plugin.js'],
    outfile: 'dist/bw-input-handler.esm.min.js',
    bundle: true,
    minify: true,
    sourcemap: false,
    format: 'esm',
    platform: 'browser',
    target: ['es2020'],
  });
  console.log('✅ Input handler build complete!');
}
build().catch(console.error);
