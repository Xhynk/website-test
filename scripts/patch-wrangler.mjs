import { readFileSync, writeFileSync } from 'node:fs';

const path = 'dist/server/wrangler.json';
const config = JSON.parse(readFileSync(path, 'utf-8'));
config.compatibility_flags = ['nodejs_compat'];
writeFileSync(path, JSON.stringify(config));
console.log('Patched wrangler.json with nodejs_compat flag');
