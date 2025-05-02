import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom Document component for Pages Router
 */
export default function Document() {
  return (
    <Html lang="ko">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 