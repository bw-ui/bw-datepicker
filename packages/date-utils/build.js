import * as esbuild from 'esbuild';
import { mkdirSync, existsSync } from 'fs';
async function build() {
  console.log('📦 Building @bw-ui/datepicker-date-utils...');
  if (!existsSync('dist')) mkdirSync('dist');
  await esbuild.build({
    entryPoints: ['src/plugin.js'],
    outfile: 'dist/bw-date-utils.min.js',
    bundle: true,
    minify: true,
    sourcemap: false,
    format: 'iife',
    globalName: 'BWDateUtils',
    platform: 'browser',
    target: ['es2020'],
  });
  await esbuild.build({
    entryPoints: ['src/plugin.js'],
    outfile: 'dist/bw-date-utils.esm.min.js',
    bundle: true,
    minify: true,
    sourcemap: false,
    format: 'esm',
    platform: 'browser',
    target: ['es2020'],
  });
  console.log('✅ Date utils build complete!');
}
build().catch(console.error);
