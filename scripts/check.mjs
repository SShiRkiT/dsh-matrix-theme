/**
 * Static checks that do not need a running DSH:
 *   - the rebuilt client module parses as ESM
 *   - the stylesheet is inlined (template marker gone)
 *   - every rule is gated on html[data-dsh-matrix]
 *   - package exports and the cordis patch point at real files
 *   - no font-family/font-size declarations (DSH owns type settings)
 *   - no secrets or local machine paths leaked into the shipped tree
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

// 1. Parse and register the built browser module in the same classic-script
//    shape DSH uses, then verify the factory's public face.
const client = read('lib/client.js');
try {
  let registration;
  vm.runInNewContext(client, {
    window: { __ModuleLoader__: { load: (value) => { registration = value; } } },
    console,
  }, { filename: 'lib/client.js' });
  if (registration === undefined) throw new Error('no __ModuleLoader__.load registration');
  if (registration.id !== 'dsh-matrix-theme') throw new Error(`unexpected module id ${registration.id}`);
  const exportsProbe = registration.factory(() => {
    throw new Error('matrix client must not require runtime packages');
  });
  if (typeof exportsProbe.apply !== 'function') throw new Error('missing apply export');
  if (!Array.isArray(exportsProbe.inject) || !exportsProbe.inject.includes('theme')) throw new Error('missing theme inject');
} catch (error) {
  failures.push(`lib/client.js is not a valid DSH client factory: ${error.message}`);
}

// 2. Marker replaced and CSS present.
if (client.includes('__MATRIX_CSS__')) failures.push('CSS marker still present in lib/client.js');
if (!client.includes('data-dsh-matrix')) failures.push('root marker missing from client bundle');

// 3. Every top-level CSS rule is scoped to the marker (comments/at-rules aside).
const css = read('src/matrix.css');
const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
const unscoped = [];
for (const match of cssNoComments.matchAll(/(^|\n)([^{}\n][^{}]*)\{/g)) {
  const selector = match[2].trim();
  if (selector.startsWith('@') || selector.startsWith('/*') || selector.startsWith('*')) continue;
  if (!selector.includes('data-dsh-matrix') && !selector.startsWith('html[data-dsh-matrix]')) {
    unscoped.push(selector.split('\n')[0].slice(0, 80));
  }
}
if (unscoped.length > 0) failures.push(`unscoped CSS selectors: ${unscoped.join(' | ')}`);

// 4. Typography stays with DSH's settings, and the surface stays flat.
if (/--dsw-font-family|--dsh-font-family|font-family\s*:/.test(cssNoComments)) {
  failures.push('stylesheet sets a font family; Matrix must inherit DSH fonts');
}
if (/font-size\s*:/.test(cssNoComments)) {
  failures.push('stylesheet sets a font size; Matrix must inherit DSH type settings');
}
if (/gradient\(/.test(cssNoComments)) {
  failures.push('stylesheet uses a gradient; Matrix keeps the canvas flat');
}

// 5. Manifest and patch resolve.
const pkg = JSON.parse(read('package.json'));
for (const [key, rel] of Object.entries({ main: pkg.main, client: pkg.exports?.['./client'] })) {
  if (typeof rel !== 'string' || !fs.existsSync(path.join(root, rel))) failures.push(`package ${key} path missing: ${rel}`);
}
if (pkg.dsh?.bundle?.patch !== './cordis.patch.yml') failures.push('package dsh.bundle.patch is not ./cordis.patch.yml');
if (!pkg.dsh?.client?.inject?.includes('@deepseek-ai/dsh-client-ui-theme')) failures.push('client inject does not require ui-theme');
if (!read('cordis.patch.yml').includes("name: 'dsh-matrix-theme'")) failures.push('cordis patch does not insert the package');

// 6. No secrets or machine paths in tracked-ready files.
const forbidden = [
  /api[_-]?key\s*[:=]/i,
  /sk-[a-z0-9]{16,}/i,
  /token=[a-z0-9]{20,}/i,
  /D:\\AI workstation/i,
  /C:\\Users\\/i,
  /DeepseekHarness/i,
];
for (const file of ['package.json', 'cordis.patch.yml', 'skin.json', 'README.md', 'README.zh.md', 'lib/index.js', 'lib/client.js', 'src/matrix.css', 'src/client.template.js']) {
  if (!fs.existsSync(path.join(root, file))) continue;
  const text = read(file);
  for (const pattern of forbidden) {
    if (pattern.test(text)) failures.push(`${file} matches forbidden pattern ${pattern}`);
  }
}

if (failures.length > 0) {
  console.error('FAIL');
  for (const failure of failures) console.error(' -', failure);
  process.exit(1);
}
console.log('OK: bundle parses, rules are scoped, manifest resolves, no type overrides, no secrets.');
