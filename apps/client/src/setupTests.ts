import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock IndexedDB
const indexedDBMock = {
  open: jest.fn(),
  deleteDatabase: jest.fn(),
};
global.indexedDB = indexedDBMock as any;

// Mock crypto for tests
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: any) => arr,
    subtle: {
      digest: jest.fn(),
    },
  },
});

// Mock environment variables
process.env.VITE_PUZZLE_HMAC_SECRET = '715e4b8420ede04a1c5b06e0eb0f414352f4d37207c0ffeac4cca3ce15009402';