import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';

const packages = readdirSync('packages').filter(f => 
  statSync(`packages/${f}`).isDirectory()
);

console.log('🚀 Building all BW DatePicker packages...\n');
console.log(`Found ${packages.length} packages: ${packages.join(', ')}\n`);

let success = 0;
let failed = 0;

for (const pkg of packages) {
  console.log(`\n📦 Building ${pkg}...`);
  try {
    execSync(`cd packages/${pkg} && npm install --legacy-peer-deps && node build.js`, { 
      stdio: 'inherit',
      shell: true 
    });
    success++;
  } catch (e) {
    console.error(`❌ Failed: ${pkg}`);
    failed++;
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`✅ Success: ${success}`);
if (failed > 0) console.log(`❌ Failed: ${failed}`);
console.log(`${'='.repeat(50)}\n`);
