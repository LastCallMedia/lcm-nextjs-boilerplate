// Jest configuration for Next.js (T3 stack)
const nextJest = require('next/jest')({ dir: './' });

module.exports = nextJest({
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {},
});
