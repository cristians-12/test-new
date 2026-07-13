module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [],
  testPathIgnorePatterns: ['/node_modules/', '__tests__/App\\.test\\.tsx'],
  collectCoverageFrom: [
    'src/store/sagas/**/reducer.ts',
    'src/store/sagas/**/saga.ts',
    'src/utils/functions/**/*.ts',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
