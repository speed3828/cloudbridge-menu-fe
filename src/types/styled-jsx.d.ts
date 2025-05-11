// styled-jsx 타입 재정의를 통한 React 가져오기 오류 해결
import * as React from 'react';

declare module 'styled-jsx/css' {
  export default function css(chunks: TemplateStringsArray, ...args: any[]): { className: string; styles: React.ReactElement };
  export function resolve(chunks: TemplateStringsArray, ...args: any[]): { className: string; styles: React.ReactElement };
  export function keyframes(chunks: TemplateStringsArray, ...args: any[]): string;
  export function global(chunks: TemplateStringsArray, ...args: any[]): { styles: React.ReactElement };
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      css?: any;
    }
  }
} 