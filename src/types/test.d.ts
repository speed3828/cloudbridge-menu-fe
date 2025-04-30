// Jest 타입 정의
declare module 'jest' {
  global {
    function describe(name: string, fn: () => void): void;
    function it(name: string, fn: () => void): void;
    function expect<T>(value: T): {
      toBe(expected: T): void;
      toEqual(expected: any): void;
      // 기타 필요한 메서드
    };
  }
}

// Node 타입 정의
declare module 'node' {
  namespace NodeJS {
    interface Process {
      env: ProcessEnv;
    }
    
    interface ProcessEnv {
      [key: string]: string | undefined;
    }
  }
}

// crypto-js 타입 정의
declare module 'crypto-js' {
  namespace CryptoJS {
    function AES(message: string, key: string): any;
    function MD5(message: string): any;
    function SHA256(message: string): any;
    // 기타 필요한 메서드
  }
  
  export = CryptoJS;
} 