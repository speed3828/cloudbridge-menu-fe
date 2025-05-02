// Type definitions for Next.js

declare module 'next' {
  /**
   * Metadata for Next.js app router
   */
  export interface Metadata {
    title?: string | null;
    description?: string | null;
    [key: string]: any;
  }

  /**
   * Next.js page type
   */
  export type NextPage<P = {}, IP = P> = React.ComponentType<P> & {
    getInitialProps?: (context: any) => IP | Promise<IP>;
  };
}

declare module 'next/router' {
  export function useRouter(): {
    route: string;
    pathname: string;
    query: Record<string, string | string[] | undefined>;
    asPath: string;
    push: (url: string, as?: string, options?: any) => Promise<boolean>;
    replace: (url: string, as?: string, options?: any) => Promise<boolean>;
    reload: () => void;
    back: () => void;
    prefetch: (url: string) => Promise<void>;
    beforePopState: (cb: (state: any) => boolean) => void;
    events: {
      on: (type: string, handler: (...evts: any[]) => void) => void;
      off: (type: string, handler: (...evts: any[]) => void) => void;
      emit: (type: string, ...evts: any[]) => void;
    };
    isFallback: boolean;
    isReady: boolean;
    isPreview: boolean;
  };
} 