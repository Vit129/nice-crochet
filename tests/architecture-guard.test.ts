import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const repo = process.cwd();
const fixtures = path.join(repo, 'tests/fixtures');

function sourceFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? sourceFiles(file) : /\.[jt]sx?$|\.fixture$/.test(entry.name) ? [file] : [];
  });
}

// Keep strings intact for regex matching while removing line and block comments.
function stripComments(source: string): string {
  let output = '';
  let quote = '';
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];
    if (quote) {
      output += char;
      if (char === '\\') output += source[++i] ?? '';
      else if (char === quote) quote = '';
    } else if (char === '"' || char === "'" || char === '`') {
      quote = char;
      output += char;
    } else if (char === '/' && next === '/') {
      while (i < source.length && source[i] !== '\n') i += 1;
      output += '\n';
    } else if (char === '/' && next === '*') {
      i += 2;
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) i += 1;
      i += 1;
    } else {
      output += char;
    }
  }
  return output;
}

function findMatches(source: string, pattern: RegExp): string[] {
  return [...stripComments(source).matchAll(pattern)].map((match) => match[0]);
}

function checkUi(root: string): string[] {
  const pattern = /\bfetch\s*\(|\blocalStorage\b|\bsessionStorage\b|\bXMLHttpRequest\b|\bnavigator\s*\.\s*sendBeacon\b/g;
  const dirs = ['src/components', 'src/app'];
  return dirs.flatMap((dir) => sourceFiles(path.join(root, dir)).flatMap((file) =>
    findMatches(readFileSync(file, 'utf8'), pattern).map((match) => `${path.relative(root, file)}: ${match}`)));
}

function checkSearch(root: string): string[] {
  const tsFile = path.join(root, 'src/lib/search.ts');
  const file = existsSync(tsFile) ? tsFile : path.join(root, 'src/lib/search.fixture');
  const code = stripComments(readFileSync(file, 'utf8'));
  const imports = /(?:\bfrom\s*|\bimport\s*\(\s*)['"](?:react|next\/[^'"]*|@\/components(?:\/[^'"]*)?)['"]|\bimport\s*['"](?:react|next\/[^'"]*|@\/components(?:\/[^'"]*)?)['"]/g;
  const globals = /\bfetch\s*\(|\bwindow\b|\bdocument\b|\blocalStorage\b/g;
  return [
    ...[...code.matchAll(imports)].map((match) => `src/lib/search.ts: forbidden import ${match[0]}`),
    ...[...code.matchAll(globals)].map((match) => `src/lib/search.ts: forbidden global ${match[0]}`),
  ];
}

function checkQuarantine(root: string): string[] {
  const base = path.join(root, 'src/lib');
  const pattern = /\bfetch\s*\(|\blocalStorage\b|\bwindow\s*\./g;
  return sourceFiles(base).flatMap((file) => {
    const relative = path.relative(root, file).split(path.sep).join('/');
    if (relative === 'src/lib/clickTracking.ts' || relative === 'src/lib/clickTracking.fixture') return [];
    return findMatches(readFileSync(file, 'utf8'), pattern).map((match) => `${relative}: ${match}`);
  });
}

const checks = [
  { name: 'UI direct I/O', run: checkUi, bad: 'bad-ui' },
  { name: 'pure search core', run: checkSearch, bad: 'bad-core' },
  { name: 'src/lib I/O quarantine', run: checkQuarantine, bad: 'bad-quarantine' },
];

test('architecture guard: UI makes no direct I/O (baseline: 0)', () => {
  const violations = checkUi(repo);
  assert.equal(violations.length, 0, `${violations.length} direct I/O match(es): ${violations.join(', ')}. Move I/O behind src/lib/clickTracking.ts; do not call fetch from components.`);
});

test('architecture guard: search stays pure (baseline: 0)', () => {
  const violations = checkSearch(repo);
  assert.equal(violations.length, 0, `${violations.length} pure-core violation(s): ${violations.join(', ')}. Keep src/lib/search.ts independent of React, Next, components, and browser I/O.`);
});

test('architecture guard: src/lib I/O stays quarantined (baseline: 0)', () => {
  const violations = checkQuarantine(repo);
  assert.equal(violations.length, 0, `${violations.length} quarantined I/O violation(s): ${violations.join(', ')}. Move I/O behind src/lib/clickTracking.ts.`);
});

for (const check of checks) {
  test(`architecture guard negative control: ${check.name} rejects bad fixture and accepts clean fixture`, () => {
    const bad = path.join(fixtures, check.bad);
    const clean = path.join(fixtures, 'clean');
    assert.ok(check.run(bad).length > 0, `${check.name} did not catch ${check.bad}`);
    assert.deepEqual(check.run(clean), [], `${check.name} rejected the clean fixture`);
  });
}
