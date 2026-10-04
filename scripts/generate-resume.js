// Compatibility entry point: node scripts/generate-resume.js
// Install the generator dependency with: python3 -m pip install reportlab
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const result = spawnSync('python3', [path.join(__dirname, 'generate-resume.py')], { stdio: 'inherit' });
if (result.error) { console.error(result.error.message); process.exit(1); }
process.exit(result.status === null ? 1 : result.status);
