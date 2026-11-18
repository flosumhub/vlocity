// Workaround: runtime-plugin-manager-clone@0.1.0 rejects .cjs;
// modern less uses less-node.cjs. Upstream live-plugin-manager already allows .cjs.
// Remove when vlocity upgrades its plugin manager.
const fs = require('fs');
const path = require('path');

const file = path.join(
  __dirname,
  '../node_modules/runtime-plugin-manager-clone/dist/src/PluginVm.js'
);

if (!fs.existsSync(file)) {
  console.warn('PluginVm.js not found, skip');
  process.exit(0);
}

let code = fs.readFileSync(file, 'utf8');

const from = 'if (filePathExtension === ".js")';
const to = 'if (filePathExtension === ".js" || filePathExtension === ".cjs")';

if (!code.includes(from)) {
  if (code.includes('.cjs')) {
    console.log('Already patched');
    process.exit(0);
  }
  console.error('Expected pattern not found');
  process.exit(1);
}

fs.writeFileSync(file, code.replace(from, to));
console.log('OK: PluginVm.js patched — .cjs allowed');