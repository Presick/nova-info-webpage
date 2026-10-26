// Copies the reviewed pages and the Census data from the project folder into ./content
// so the site folder is self-contained when deployed. If the parent folders are not
// present (for example on a host that only has the site folder), the existing ./content is used.
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const srcPages = join(root, '..', 'pages');
const srcData = join(root, '..', 'data');
const outPages = join(root, 'content', 'pages');
const outData = join(root, 'content', 'data');

if (existsSync(srcPages)) {
  mkdirSync(outPages, { recursive: true });
  for (const f of readdirSync(srcPages)) {
    if (f.endsWith('.md') && !f.endsWith('.gate.md')) cpSync(join(srcPages, f), join(outPages, f));
  }
  console.log('synced pages');
}
if (existsSync(srcData)) {
  mkdirSync(outData, { recursive: true });
  for (const f of readdirSync(srcData)) {
    if (f.endsWith('.csv')) cpSync(join(srcData, f), join(outData, f));
  }
  console.log('synced data');
}
