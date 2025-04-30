// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
}));

// Mock window.performance
Object.defineProperty(window, 'performance', {
  value: {
    getEntriesByType: jest.fn(),
    getEntriesByName: jest.fn(),
  },
  writable: true,
}); 