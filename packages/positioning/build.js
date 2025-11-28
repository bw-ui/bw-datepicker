import * as esbuild from 'esbuild';
import { mkdirSync, existsSync } from 'fs';
async function build() {
  console.log('📦 Building @bw-ui/datepicker-positioning...');
  if (!existsSync('dist')) mkdirSync('dist');
  await esbuild.build({ entryPoints: ['src/plugin.js'], outfile: 'dist/bw-positioning.min.js', bundle: true, minify: true, sourcemap: true, format: 'iife', globalName: 'BWPositioning', platform: 'browser', target: ['es2020'] });
  await esbuild.build({ entryPoints: ['src/plugin.js'], outfile: 'dist/bw-positioning.esm.min.js', bundle: true, minify: true, sourcemap: true, format: 'esm', platform: 'browser', target: ['es2020'] });
  console.log('✅ Positioning build complete!');
}
build().catch(console.error);
