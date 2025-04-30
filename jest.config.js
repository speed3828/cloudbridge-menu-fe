const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // next.config.js와 .env 파일을 로드하기 위한 Next.js 앱의 경로
  dir: './',
});

// Jest에 전달할 커스텀 설정
const customJestConfig = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        isolatedModules: true, // 타입 체크 건너뛰기
      },
    ],
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  collectCoverage: false,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
};

// createJestConfig를 내보내서 next/jest가 비동기 Next.js 설정을 로드할 수 있도록 합니다
module.exports = createJestConfig(customJestConfig); 