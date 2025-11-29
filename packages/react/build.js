import * as esbuild from 'esbuild';
import { mkdirSync, existsSync } from 'fs';

async function build() {
  console.log('📦 Building @bw-ui/datepicker-react...');

  if (!existsSync('dist')) mkdirSync('dist');

  // Common build options
  const common = {
    entryPoints: ['src/index.js'],
    bundle: true,
    minify: true,
    sourcemap: false,
    target: ['es2020'],
    // Mark React and core as external (peer dependencies)
    external: ['react', 'react-dom', '@bw-ui/datepicker'],
    // Handle JSX
    jsx: 'automatic',
    jsxImportSource: 'react',
  };

  // ESM build (for bundlers)
  await esbuild.build({
    ...common,
    outfile: 'dist/bw-react.esm.min.js',
    format: 'esm',
    platform: 'neutral',
  });

  // CJS build (for Node/older bundlers)
  await esbuild.build({
    ...common,
    outfile: 'dist/bw-react.min.js',
    format: 'cjs',
    platform: 'neutral',
  });

  console.log('✅ React build complete!');
}

build().catch(console.error);
