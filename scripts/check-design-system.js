#!/usr/bin/env node
/**
 * Design system guardrails — fails CI/local if token/nesting regressions return.
 *
 * Checks:
 * 1. CSS files under css/ (except variables.css) have no hardcoded hex / linear-gradient
 * 2. Required tokens exist in variables.css
 * 3. Archive page section in override.css is not nested inside a media query
 * 4. projects.md / tools.md have no inline <style> blocks
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
let failed = false;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed = true;
}

function ok(msg) {
  console.log(`OK:   ${msg}`);
}

// 1) Required tokens
const variablesPath = path.join(root, 'css/variables.css');
const variables = fs.readFileSync(variablesPath, 'utf8');
const requiredTokens = [
  '--color-primary',
  '--color-primary-dark',
  '--color-secondary',
  '--color-secondary-dark',
  '--color-accent',
  '--color-on-primary',
  '--color-bg',
  '--color-bg-alt',
  '--color-border',
  '--color-text',
  '--color-text-muted',
  '--font-family',
];
for (const token of requiredTokens) {
  if (!variables.includes(token + ':') && !variables.includes(token + ' :')) {
    // allow token present as --token:
    if (!new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*:').test(variables)) {
      fail(`Missing token ${token} in css/variables.css`);
    }
  }
}
ok(`Required tokens present (${requiredTokens.length})`);

// 2) No hex / gradient outside variables.css
const hexOrGrad = /#[0-9a-fA-F]{3,8}|linear-gradient/i;
const cssDir = path.join(root, 'css');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.css')) out.push(full);
  }
  return out;
}

const offenders = [];
for (const file of walk(cssDir)) {
  if (path.basename(file) === 'variables.css') continue;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (hexOrGrad.test(line)) {
      offenders.push(`${path.relative(root, file)}:${i + 1}: ${line.trim()}`);
    }
  });
}
if (offenders.length) {
  fail(`Hardcoded hex/gradient outside variables.css (${offenders.length})`);
  offenders.slice(0, 20).forEach((o) => console.error('  ' + o));
} else {
  ok('No hex/gradient outside css/variables.css');
}

// 3) Archive block not nested
const overridePath = path.join(root, 'css/override.css');
const overrideLines = fs.readFileSync(overridePath, 'utf8').split('\n');
let depth = 0;
let archiveDepth = null;
for (let i = 0; i < overrideLines.length; i++) {
  const line = overrideLines[i];
  if (line.includes('ARCHIVE PAGE')) {
    archiveDepth = depth;
  }
  depth += (line.match(/\{/g) || []).length;
  depth -= (line.match(/\}/g) || []).length;
}
if (depth !== 0) {
  fail(`css/override.css brace imbalance (final depth ${depth})`);
} else {
  ok('css/override.css braces balanced');
}
if (archiveDepth === null) {
  fail('ARCHIVE PAGE section marker missing in css/override.css');
} else if (archiveDepth !== 0) {
  fail(`ARCHIVE PAGE nested at depth ${archiveDepth} (must be 0 — global)`);
} else {
  ok('ARCHIVE PAGE styles are global (not inside media query)');
}

// 4) No inline styles in content pages that previously leaked hex
for (const rel of ['projects.md', 'tools.md', 'archive.md', 'swiftui.md', '_tools/life-time-calculator.md']) {
  const text = fs.readFileSync(path.join(root, rel), 'utf8');
  if (/<style[\s>]/i.test(text)) {
    fail(`${rel} still contains <style> block`);
  } else {
    ok(`${rel} has no inline <style>`);
  }
}

if (failed) {
  process.exit(1);
}
console.log('\nDesign system checks passed.');
