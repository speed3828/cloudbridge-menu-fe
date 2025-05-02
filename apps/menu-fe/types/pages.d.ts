// Pages Router용 타입 정의

// React 타입 정의 확장
declare module 'react' {
  // 훅 관련 정의
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useContext<T>(context: React.Context<T>): T;
  export function useReducer<R extends React.Reducer<any, any>, I>(
    reducer: R,
    initializerArg: I,
    initializer?: (arg: I) => React.ReducerState<R>
  ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  export function useMemo<T>(factory: () => T, deps: ReadonlyArray<any> | undefined): T;
  export function useRef<T = any>(initialValue: T): { current: T };
  export function useImperativeHandle<T, R extends T>(
    ref: React.Ref<T> | undefined,
    init: () => R,
    deps?: ReadonlyArray<any>
  ): void;
  export function useLayoutEffect(effect: React.EffectCallback, deps?: ReadonlyArray<any>): void;
  export function useDebugValue<T>(value: T, format?: (value: T) => any): void;

  // 컴포넌트 타입 정의
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P & { children?: React.ReactNode }): React.ReactElement<any, any> | null;
    displayName?: string;
  }
}

// Next.js 타입 정의 확장
declare module 'next' {
  import { AppProps } from 'next/app';
  import { NextRouter } from 'next/router';
  
  export interface NextPageContext {
    req?: any;
    res?: any;
    pathname: string;
    query: any;
    asPath?: string;
    AppTree: any;
  }
  
  export type NextPage<P = {}, IP = P> = React.ComponentType<P> & {
    getInitialProps?: (context: NextPageContext) => Promise<IP> | IP;
  };
  
  export interface AppContext extends NextPageContext {
    Component: NextPage;
    router: NextRouter;
    ctx: NextPageContext;
  }
  
  export type AppComponent<P = {}> = React.ComponentType<AppProps<P>>;
  
  export interface Metadata {
    title?: string | null;
    description?: string | null;
    [key: string]: any;
  }
}

// Next Router 타입 정의
declare module 'next/router' {
  export const useRouter: () => {
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