// Jest 타입 확장
declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeInTheDocument(): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toBeDefined(): R;
      toBeUndefined(): R;
    }

    type Mock<T extends (...args: any[]) => any> = {
      (...args: Parameters<T>): ReturnType<T>;
      mockResolvedValueOnce(value: any): Mock<T>;
      mockRejectedValueOnce(value: any): Mock<T>;
    };
  }

  function jest(name: string): any;
  namespace jest {
    function fn(): jest.Mock<any>;
    function clearAllMocks(): void;
    function mock(path: string, factory?: () => any): void;
  }

  function beforeEach(fn: () => void): void;
  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => void | Promise<void>): void;
} 