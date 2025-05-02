import * as React from 'react';

// React 네임스페이스 확장 (augmentation)
declare module 'react' {
  // 훅 관련 타입 정의
  export function useState<T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>];
  export function useEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
  
  // FC 타입 정의
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P & { children?: React.ReactNode }): React.ReactElement<any, any> | null;
    displayName?: string;
  }
} 