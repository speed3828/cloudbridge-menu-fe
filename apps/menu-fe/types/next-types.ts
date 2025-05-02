// Type definitions for Next.js
import React from 'react';

// Metadata for Next.js app router
export interface Metadata {
  title?: string | null;
  description?: string | null;
  [key: string]: any;
}

// Next.js page type
export type NextPage<P = {}, IP = P> = React.ComponentType<P> & {
  getInitialProps?: (context: any) => IP | Promise<IP>;
}; 