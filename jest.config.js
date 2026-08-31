/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.spec.ts'],
  globalSetup: '<rootDir>/tests/globalSetup.ts',
  // ResMan is not auto-scaled and the connector retries with 15s backoffs.
  // Run serially so the suite never competes with itself for rate limit.
  maxWorkers: 1,
  testTimeout: 180000,
  verbose: true,
};
