/**
 * Build the browser half.
 *
 * DSH's client module system loads third-party UI entries as classic scripts
 * that register a factory with `window.__ModuleLoader__.load({ id, factory })`
 * and consume `module.exports` — not as native ES modules. This script wraps
 * the readable source body in that factory and inlines the stylesheet, so the
 * published `lib/client.js` is one self-contained file.
 *
 * No bundler or network install is needed to rebuild: node scripts/build.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const template = fs.readFileSync(path.join(root, 'src', 'client.template.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src', 'matrix.css'), 'utf8');

if (!template.includes('__MATRIX_CSS__')) {
  throw new Error('src/client.template.js is missing the __MATRIX_CSS__ marker');
}

const body = template.replace('__MATRIX_CSS__', JSON.stringify(css));
const output = `window.__ModuleLoader__.load({
  id: ${JSON.stringify(pkg.name)},
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

${body}

    exports.inject = inject;
    exports.apply = apply;
    exports.MATRIX_TOKENS = TOKENS;
    return module.exports;
  }
});
`;

fs.mkdirSync(path.join(root, 'lib'), { recursive: true });
fs.writeFileSync(path.join(root, 'lib', 'client.js'), output);

// Local preview harness input: resolve the factory once and persist the token
// table. Never published (the package `files` list only ships lib/).
let registration;
vm.runInNewContext(output, {
  window: { __ModuleLoader__: { load: (value) => { registration = value; } } },
  console,
}, { filename: 'lib/client.js' });
if (registration === undefined) throw new Error('built bundle did not register a module factory');
const exportsProbe = registration.factory((name) => {
  throw new Error(`unexpected require(${name})`);
});
const previewFile = path.join(root, '.dev', 'preview-tokens.json');
fs.mkdirSync(path.dirname(previewFile), { recursive: true });
fs.writeFileSync(previewFile, JSON.stringify(exportsProbe.MATRIX_TOKENS, null, 2));

console.log(`built lib/client.js (${Buffer.byteLength(output)} bytes) as ${pkg.name}`);
