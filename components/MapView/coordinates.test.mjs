import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync(fileURLToPath(new URL('./coordinates.ts', import.meta.url)), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const exportsObject = {};
runInNewContext(compiled, { exports: exportsObject });
const { isValidCoordinates } = exportsObject;

test('accepts zero, ordinary coordinates and inclusive geographic bounds', () => {
  for (const value of [
    { lat: 0, lon: 0 },
    { lat: 50.4501, lon: 30.5234 },
    { lat: -90, lon: -180 },
    { lat: 90, lon: 180 },
  ])
    assert.equal(isValidCoordinates(value), true);
});

test('rejects missing, nonnumeric, nonfinite and out-of-range coordinates', () => {
  for (const value of [
    null,
    undefined,
    {},
    { lat: 1 },
    { lat: 1, lng: 2 },
    { lat: '1', lon: 2 },
    { lat: 1, lon: '2' },
    { lat: NaN, lon: 0 },
    { lat: 0, lon: Infinity },
    { lat: -Infinity, lon: 0 },
    { lat: -90.001, lon: 0 },
    { lat: 90.001, lon: 0 },
    { lat: 0, lon: -180.001 },
    { lat: 0, lon: 180.001 },
  ])
    assert.equal(isValidCoordinates(value), false);
});
