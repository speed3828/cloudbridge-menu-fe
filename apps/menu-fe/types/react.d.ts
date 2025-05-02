// React type definitions

import * as React from 'react';

// jsx-runtime에 대한 타입 정의 추가
declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  
  export function jsx(
    type: React.ElementType,
    props: any,
    key?: React.Key | null | undefined
  ): React.ReactElement;
  
  export function jsxs(
    type: React.ElementType, 
    props: any, 
    key?: React.Key | null | undefined
  ): React.ReactElement;
}

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  namespace React {
    interface FormEvent<T = Element> extends SyntheticEvent<T> {
      target: EventTarget & T;
    }

    interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
      target: EventTarget & T;
    }

    interface SyntheticEvent<T = Element, E = Event> {
      bubbles: boolean;
      cancelable: boolean;
      currentTarget: EventTarget & T;
      defaultPrevented: boolean;
      eventPhase: number;
      isTrusted: boolean;
      nativeEvent: E;
      preventDefault(): void;
      stopPropagation(): void;
      target: EventTarget & T;
      timeStamp: number;
      type: string;
    }

    type FC<P = {}> = FunctionComponent<P>;
    interface FunctionComponent<P = {}> {
      (props: P & { children?: React.ReactNode }): React.ReactElement | null;
      displayName?: string;
    }
  }
} 