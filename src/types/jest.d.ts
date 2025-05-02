/// <reference types="jest" />

// Jest 전역 변수 및 함수 타입 정의
declare global {
  const jest: typeof import('jest');
  const describe: (name: string, fn: () => void) => void;
  const beforeEach: (fn: () => void) => void;
  const afterEach: (fn: () => void) => void;
  const beforeAll: (fn: () => void) => void;
  const afterAll: (fn: () => void) => void;
  const it: (name: string, fn: () => void | Promise<void>, timeout?: number) => void;
  const test: typeof it;
  const expect: <T>(actual: T) => {
    toBe: (expected: T) => void;
    toEqual: (expected: any) => void;
    toBeDefined: () => void;
    toBeUndefined: () => void;
    toBeNull: () => void;
    toBeTruthy: () => void;
    toBeFalsy: () => void;
    toContain: (expected: any) => void;
    toHaveBeenCalled: () => void;
    toHaveBeenCalledWith: (...args: any[]) => void;
    toHaveBeenCalledTimes: (count: number) => void;
    toHaveLength: (length: number) => void;
    toMatch: (regex: RegExp | string) => void;
    toMatchObject: (object: object) => void;
    toThrow: (error?: string | Error | RegExp) => void;
    not: {
      toBe: (expected: T) => void;
      toEqual: (expected: any) => void;
      toBeDefined: () => void;
      toBeUndefined: () => void;
      toBeNull: () => void;
      toBeTruthy: () => void;
      toBeFalsy: () => void;
      toContain: (expected: any) => void;
      toHaveBeenCalled: () => void;
      toHaveBeenCalledWith: (...args: any[]) => void;
      toHaveBeenCalledTimes: (count: number) => void;
      toHaveLength: (length: number) => void;
      toMatch: (regex: RegExp | string) => void;
      toMatchObject: (object: object) => void;
      toThrow: (error?: string | Error | RegExp) => void;
    };
    resolves: {
      toBe: (expected: T) => Promise<void>;
      toEqual: (expected: any) => Promise<void>;
      toBeDefined: () => Promise<void>;
      toBeUndefined: () => Promise<void>;
      toBeNull: () => Promise<void>;
      toBeTruthy: () => Promise<void>;
      toBeFalsy: () => Promise<void>;
      toContain: (expected: any) => Promise<void>;
      toHaveBeenCalled: () => Promise<void>;
      toHaveBeenCalledWith: (...args: any[]) => Promise<void>;
      toHaveBeenCalledTimes: (count: number) => Promise<void>;
      toHaveLength: (length: number) => Promise<void>;
      toMatch: (regex: RegExp | string) => Promise<void>;
      toMatchObject: (object: object) => Promise<void>;
      toThrow: (error?: string | Error | RegExp) => Promise<void>;
    };
    rejects: {
      toBe: (expected: T) => Promise<void>;
      toEqual: (expected: any) => Promise<void>;
      toBeDefined: () => Promise<void>;
      toBeUndefined: () => Promise<void>;
      toBeNull: () => Promise<void>;
      toBeTruthy: () => Promise<void>;
      toBeFalsy: () => Promise<void>;
      toContain: (expected: any) => Promise<void>;
      toHaveBeenCalled: () => Promise<void>;
      toHaveBeenCalledWith: (...args: any[]) => Promise<void>;
      toHaveBeenCalledTimes: (count: number) => Promise<void>;
      toHaveLength: (length: number) => Promise<void>;
      toMatch: (regex: RegExp | string) => Promise<void>;
      toMatchObject: (object: object) => Promise<void>;
      toThrow: (error?: string | Error | RegExp) => Promise<void>;
    };
  };

  // Jest 모의 함수 (mock) 타입 정의
  namespace jest {
    type Mock<T = any, Y extends any[] = any[]> = {
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
      getMockImplementation: () => ((...args: Y) => T) | undefined;
      mock: {
        calls: Y[];
        results: Array<{ type: string; value: T }>;
        instances: any[];
        invocationCallOrder: number[];
        lastCall: Y;
      };
    };

    function fn<T = any, Y extends any[] = any[]>(): Mock<T, Y>;
    function fn<T = any, Y extends any[] = any[]>(implementation: (...args: Y) => T): Mock<T, Y>;

    function clearAllMocks(): void;
    function resetAllMocks(): void;
    function restoreAllMocks(): void;
    function spyOn(object: any, method: string): Mock;
    function mock(moduleName: string, factory?: any, options?: any): typeof jest;
  }
}

export {}; 