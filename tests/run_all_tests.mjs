/**
 * Master Test Runner for CobaDulu Education Guidance Platform
 * Executes Tiers 1-4 Automated Test Suite and reports consolidated results.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const testSuites = [
  { tier: 'Tier 1', name: 'Feature Coverage (>=5 per feature)', file: 'tier1_feature_coverage.test.mjs' },
  { tier: 'Tier 2', name: 'Boundary & Corner Cases (>=5 per feature)', file: 'tier2_boundary_corner.test.mjs' },
  { tier: 'Tier 3', name: 'Cross-Feature Combinations (Pairwise)', file: 'tier3_cross_feature.test.mjs' },
  { tier: 'Tier 4', name: 'Real-World Scenarios (Persona Journeys)', file: 'tier4_real_world_persona.test.mjs' },
];

async function runSuite(suite) {
  const filePath = path.join(__dirname, suite.file);
  return new Promise((resolve) => {
    const startTime = Date.now();
    const child = spawn(process.execPath, ['--test', filePath], {
      cwd: PROJECT_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });

    child.on('close', (code) => {
      const elapsedMs = Date.now() - startTime;

      // Extract test counts from TAP output
      const passMatch = stdout.match(/# pass (\d+)/);
      const failMatch = stdout.match(/# fail (\d+)/);
      const testsMatch = stdout.match(/# tests (\d+)/);

      const tests = testsMatch ? parseInt(testsMatch[1], 10) : 0;
      const pass = passMatch ? parseInt(passMatch[1], 10) : (code === 0 ? tests : 0);
      const fail = failMatch ? parseInt(failMatch[1], 10) : (code !== 0 ? 1 : 0);

      resolve({
        suite,
        code,
        elapsedMs,
        tests,
        pass,
        fail,
        stdout,
        stderr,
      });
    });
  });
}

async function main() {
  console.log('\n======================================================================');
  console.log('   CobaDulu Education Guidance Platform — Automated Test Suite');
  console.log('   Tiers 1–4 Verification & Quality Assurance Runner');
  console.log('======================================================================\n');

  let totalTests = 0;
  let totalPass = 0;
  let totalFail = 0;
  let allSuccess = true;
  const results = [];

  for (const s of testSuites) {
    process.stdout.write(` Running [${s.tier}] ${s.name} ... `);
    const result = await runSuite(s);
    results.push(result);

    totalTests += result.tests;
    totalPass += result.pass;
    totalFail += result.fail;

    if (result.code === 0 && result.fail === 0) {
      console.log(`\x1b[32mPASS\x1b[0m (${result.pass}/${result.tests} tests, ${result.elapsedMs}ms)`);
    } else {
      console.log(`\x1b[31mFAIL\x1b[0m (${result.fail} failed, ${result.elapsedMs}ms)`);
      allSuccess = false;
      console.error(result.stdout || result.stderr);
    }
  }

  console.log('\n----------------------------------------------------------------------');
  console.log('   Consolidated Results Summary');
  console.log('----------------------------------------------------------------------');
  for (const r of results) {
    const status = r.code === 0 && r.fail === 0 ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
    console.log(` - ${r.suite.tier.padEnd(8)}: ${status} | Tests: ${String(r.tests).padStart(2)} | Passed: ${String(r.pass).padStart(2)} | Failed: ${String(r.fail).padStart(2)} | ${r.elapsedMs}ms`);
  }
  console.log('----------------------------------------------------------------------');
  console.log(` Total Suites : ${testSuites.length}`);
  console.log(` Total Tests  : ${totalTests}`);
  console.log(` Total Passed : ${totalPass}`);
  console.log(` Total Failed : ${totalFail}`);
  console.log('======================================================================\n');

  if (allSuccess) {
    console.log('\x1b[32m>>> ALL TESTS PASSED SUCCESSFULLY! TEST SUITE IS READY (TEST_READY.md) <<<\x1b[0m\n');
    process.exit(0);
  } else {
    console.error('\x1b[31m>>> SOME TESTS FAILED. PLEASE REVIEW LOGS ABOVE. <<<\x1b[0m\n');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test runner encountered unexpected error:', err);
  process.exit(1);
});
