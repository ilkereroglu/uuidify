import { mkdir, cp, rm, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = new URL('..', import.meta.url);
const workspace = resolve(new URL('.', root).pathname, '..');
const outDir = resolve(new URL('.', root).pathname, 'out');
const srcDir = resolve(new URL('.', root).pathname, 'src');

async function main() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await cp(srcDir, outDir, { recursive: true });
  await copyFile(resolve(workspace, 'theme/tokens.css'), resolve(outDir, 'tokens.css'));
  console.log(`status site built → ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
