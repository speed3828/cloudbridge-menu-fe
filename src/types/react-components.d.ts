import React from 'react';

// React.Component 클래스의 ErrorBoundary 인스턴스 타입 문제 해결을 위한 타입 확장
declare module 'react' {
  interface Component<P = {}, S = {}> {
    props: P;
    state: S;
    setState(state: S | ((prevState: S, props: P) => S), callback?: () => void): void;
    forceUpdate(callback?: () => void): void;
    context: any;
    render(): React.ReactNode;
  }
}

// ErrorBoundary 클래스를 위한 추가 타입 선언
declare global {
  namespace JSX {
    interface ElementClass {
      props?: any;
      state?: any;
      render(): React.ReactNode;
    }
  }
} 