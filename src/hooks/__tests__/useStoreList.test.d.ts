// Import Jest type definitions
/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
/// <reference types="@testing-library/react" />

// Mock type definitions
declare namespace jest {
  interface Mock<T = any, Y extends any[] = any[]> {
    (...args: Y): T;
    mockImplementation: (fn: (...args: Y) => T) => Mock<T, Y>;
    mockImplementationOnce: (fn: (...args: Y) => T) => Mock<T, Y>;
    mockReturnValue: (value: T) => Mock<T, Y>;
    mockReturnValueOnce: (value: T) => Mock<T, Y>;
    mockResolvedValue: <U>(value: U) => Mock<Promise<U>, Y>;
    mockResolvedValueOnce: <U>(value: U) => Mock<Promise<U>, Y>;
    mockRejectedValue: (error: Error | string) => Mock<Promise<any>, Y>;
    mockRejectedValueOnce: (error: Error | string) => Mock<Promise<any>, Y>;
    mockClear: () => Mock<T, Y>;
    mockReset: () => Mock<T, Y>;
    mockRestore: () => void;
    getMockName: () => string;
  }

  function fn<T = any, Y extends any[] = any[]>(): Mock<T, Y>;
  function fn<T = any, Y extends any[] = any[]>(implementation: (...args: Y) => T): Mock<T, Y>;
  function clearAllMocks(): void;
  function mock(moduleName: string, factory?: any, options?: any): typeof jest;
}

// ApiClient mock type
declare interface ApiClientMock {
  get: jest.Mock<Promise<{ data: any }>, [string]>;
} 