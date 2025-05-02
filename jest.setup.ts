// 글로벌 설정 파일
import '@testing-library/jest-dom';
import '@types/jest';

// Jest 모의 함수 확장 (global 네임스페이스로 정의된 모든 타입 가져오기)
import './src/types/jest.d';
import './src/types/testing-library.d';

// 다른 전역 설정
// @ts-ignore - Setup global object for Node.js environment
(global as any).setImmediate = setTimeout;
// @ts-ignore - Setup global object for Node.js environment
(global as any).clearImmediate = clearTimeout;

// 환경변수 설정
process.env.NEXT_PUBLIC_API_BASE = '/api';

// 경고 억제
// @ts-ignore - Setup Jest mocks
console.error = jest.fn();
// @ts-ignore - Setup Jest mocks
console.warn = jest.fn(); 