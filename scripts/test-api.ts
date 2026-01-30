#!/usr/bin/env npx tsx

/**
 * API Test Script for Character Insights 2.0
 *
 * Run with: npx tsx scripts/test-api.ts
 *
 * Requires the dev server running: pnpm dev
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

const results: TestResult[] = [];

async function runTest(name: string, testFn: () => Promise<void>): Promise<void> {
  const start = Date.now();
  try {
    await testFn();
    results.push({ name, passed: true, duration: Date.now() - start });
    console.log(`✅ ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, error: message, duration: Date.now() - start });
    console.log(`❌ ${name}: ${message}`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

// ============================================
// HEALTH CHECK TESTS
// ============================================

async function testHealthCheck(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/health`);
  assert(res.ok, `Expected 200, got ${res.status}`);

  const data = await res.json();
  assert(data.status === 'healthy', 'Expected status to be healthy');
  assert(typeof data.version === 'string', 'Expected version to be string');
  assert(typeof data.timestamp === 'string', 'Expected timestamp to be string');
}

// ============================================
// USAGE API TESTS
// ============================================

async function testGetUsageEmpty(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/usage?date=1999-01-01`);
  assert(res.ok, `Expected 200, got ${res.status}`);

  const data = await res.json();
  assert(data.success === true, 'Expected success to be true');
  assert(data.data === null || Array.isArray(data.data), 'Expected data to be null or array');
}

async function testPostUsage(): Promise<void> {
  const testData = {
    date: '2026-01-21',
    socialMediaMinutes: 120,
    shoppingMinutes: 30,
    entertainmentMinutes: 90,
    datingAppsMinutes: 15,
    productivityMinutes: 240,
    newsMinutes: 45,
    gamesMinutes: 60,
    phonePickups: 85,
    lateNightUsageMinutes: 30,
    steps: 8500,
    sleepHours: 7.5,
    wakeTime: '06:30',
  };

  const res = await fetch(`${BASE_URL}/api/v1/usage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData),
  });

  assert(res.ok, `Expected 200/201, got ${res.status}`);

  const data = await res.json();
  assert(data.success === true, 'Expected success to be true');
}

async function testPostUsageValidation(): Promise<void> {
  const invalidData = {
    date: 'not-a-date',
    socialMediaMinutes: -100, // Invalid: negative
  };

  const res = await fetch(`${BASE_URL}/api/v1/usage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidData),
  });

  assert(res.status === 400, `Expected 400 for invalid data, got ${res.status}`);
}

// ============================================
// CHECK-IN API TESTS
// ============================================

async function testGetCheckInsEmpty(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/check-ins?date=1999-01-01`);
  assert(res.ok, `Expected 200, got ${res.status}`);

  const data = await res.json();
  assert(data.success === true, 'Expected success to be true');
}

async function testPostCheckIn(): Promise<void> {
  const testData = {
    date: '2026-01-21',
    moodScore: 7,
    primaryTheme: 'achiever',
    journalEntry: 'Test journal entry',
  };

  const res = await fetch(`${BASE_URL}/api/v1/check-ins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData),
  });

  assert(res.ok, `Expected 200/201, got ${res.status}`);

  const data = await res.json();
  assert(data.success === true, 'Expected success to be true');
}

async function testPostCheckInValidation(): Promise<void> {
  const invalidData = {
    date: '2026-01-21',
    moodScore: 15, // Invalid: > 10
    primaryTheme: 'invalid-theme',
  };

  const res = await fetch(`${BASE_URL}/api/v1/check-ins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidData),
  });

  assert(res.status === 400, `Expected 400 for invalid data, got ${res.status}`);
}

// ============================================
// SCORES API TESTS
// ============================================

async function testGetDailyScores(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/scores/daily?date=2026-01-21`);
  // May return 404 if no data, which is acceptable
  assert(res.ok || res.status === 404, `Expected 200 or 404, got ${res.status}`);
}

async function testGetWeeklyReport(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/scores/weekly?weekStart=2026-01-20`);
  assert(res.ok, `Expected 200, got ${res.status}`);

  const data = await res.json();
  assert(data.success === true, 'Expected success to be true');
}

// ============================================
// DATA MANAGEMENT TESTS
// ============================================

async function testDataExport(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/data/export`);
  assert(res.ok, `Expected 200, got ${res.status}`);

  const data = await res.json();
  assert(data.success === true, 'Expected success to be true');
  assert(typeof data.data === 'object', 'Expected data to be object');
}

// ============================================
// MAIN
// ============================================

async function main(): Promise<void> {
  console.log('\\n🧪 Character Insights 2.0 - API Tests\\n');
  console.log(`Testing against: ${BASE_URL}\\n`);

  // Health Check
  console.log('--- Health Check ---');
  await runTest('Health endpoint returns healthy status', testHealthCheck);

  // Usage API
  console.log('\\n--- Usage API ---');
  await runTest('GET /api/v1/usage returns empty for nonexistent date', testGetUsageEmpty);
  await runTest('POST /api/v1/usage creates entry', testPostUsage);
  await runTest('POST /api/v1/usage validates input', testPostUsageValidation);

  // Check-in API
  console.log('\\n--- Check-in API ---');
  await runTest('GET /api/v1/check-ins returns empty for nonexistent date', testGetCheckInsEmpty);
  await runTest('POST /api/v1/check-ins creates entry', testPostCheckIn);
  await runTest('POST /api/v1/check-ins validates input', testPostCheckInValidation);

  // Scores API
  console.log('\\n--- Scores API ---');
  await runTest('GET /api/v1/scores/daily handles request', testGetDailyScores);
  await runTest('GET /api/v1/scores/weekly returns report', testGetWeeklyReport);

  // Data Management
  console.log('\\n--- Data Management ---');
  await runTest('GET /api/v1/data/export returns data', testDataExport);

  // Summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log('\\n========================================');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('========================================\\n');

  if (failed > 0) {
    console.log('Failed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
