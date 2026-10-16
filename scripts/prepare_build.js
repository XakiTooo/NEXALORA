const fs = require('fs');
const path = require('path');

const baseDirs = [
  '.next',
  '.next/server',
  '.next/server/pages',
  '.next/server/app',
  '.next/static',
  '.next/static/chunks',
  '.next/static/chunks/app',
  '.next/static/css',
  '.next/types',
  '.next/types/app',
];

for (const dir of baseDirs) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {}
}

function ensureSubdirs(srcDir) {
  try {
    const items = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory()) {
        const rel = path.relative('src/app', path.join(srcDir, item.name));
        try {
          fs.mkdirSync(path.join('.next/types/app', rel), { recursive: true });
          fs.mkdirSync(path.join('.next/server/app', rel), { recursive: true });
          fs.mkdirSync(path.join('.next/static/chunks/app', rel), { recursive: true });
        } catch (e) {}
        ensureSubdirs(path.join(srcDir, item.name));
      }
    }
  } catch (e) {}
}

ensureSubdirs('src/app');
