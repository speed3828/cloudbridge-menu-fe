// @testing-library/react 타입 정의
declare module '@testing-library/react' {
  import { ReactElement } from 'react';

  // renderHook의 반환 타입
  export interface RenderHookResult<Result, Props> {
    result: {
      current: Result;
      error?: Error;
    };
    rerender: (props?: Props) => void;
    unmount: () => void;
  }

  // renderHook 함수 타입
  export function renderHook<Result, Props>(
    render: (props: Props) => Result,
    options?: {
      initialProps?: Props;
      wrapper?: React.ComponentType<any>;
    }
  ): RenderHookResult<Result, Props>;

  // waitFor 함수 타입
  export function waitFor<T>(
    callback: () => T | Promise<T>,
    options?: {
      container?: HTMLElement;
      timeout?: number;
      interval?: number;
      onTimeout?: (error: Error) => Error;
      mutationObserverOptions?: MutationObserverInit;
    }
  ): Promise<T>;

  // screen 객체
  export const screen: {
    getByText: (text: string) => HTMLElement;
    getByRole: (role: string, options?: {name?: string}) => HTMLElement;
    getByLabelText: (label: string) => HTMLElement;
    getByPlaceholderText: (placeholder: string) => HTMLElement;
    getByAltText: (alt: string) => HTMLElement;
    getByDisplayValue: (value: string) => HTMLElement;
    getByTestId: (testId: string) => HTMLElement;
    queryByText: (text: string) => HTMLElement | null;
    queryByRole: (role: string, options?: {name?: string}) => HTMLElement | null;
    queryByLabelText: (label: string) => HTMLElement | null;
    queryByPlaceholderText: (placeholder: string) => HTMLElement | null;
    queryByAltText: (alt: string) => HTMLElement | null;
    queryByDisplayValue: (value: string) => HTMLElement | null;
    queryByTestId: (testId: string) => HTMLElement | null;
    findByText: (text: string) => Promise<HTMLElement>;
    findByRole: (role: string, options?: {name?: string}) => Promise<HTMLElement>;
    findByLabelText: (label: string) => Promise<HTMLElement>;
    findByPlaceholderText: (placeholder: string) => Promise<HTMLElement>;
    findByAltText: (alt: string) => Promise<HTMLElement>;
    findByDisplayValue: (value: string) => Promise<HTMLElement>;
    findByTestId: (testId: string) => Promise<HTMLElement>;
    getAllByText: (text: string) => HTMLElement[];
    getAllByRole: (role: string) => HTMLElement[];
    getAllByLabelText: (label: string) => HTMLElement[];
    getAllByPlaceholderText: (placeholder: string) => HTMLElement[];
    getAllByAltText: (alt: string) => HTMLElement[];
    getAllByDisplayValue: (value: string) => HTMLElement[];
    getAllByTestId: (testId: string) => HTMLElement[];
    queryAllByText: (text: string) => HTMLElement[];
    queryAllByRole: (role: string) => HTMLElement[];
    queryAllByLabelText: (label: string) => HTMLElement[];
    queryAllByPlaceholderText: (placeholder: string) => HTMLElement[];
    queryAllByAltText: (alt: string) => HTMLElement[];
    queryAllByDisplayValue: (value: string) => HTMLElement[];
    queryAllByTestId: (testId: string) => HTMLElement[];
    findAllByText: (text: string) => Promise<HTMLElement[]>;
    findAllByRole: (role: string) => Promise<HTMLElement[]>;
    findAllByLabelText: (label: string) => Promise<HTMLElement[]>;
    findAllByPlaceholderText: (placeholder: string) => Promise<HTMLElement[]>;
    findAllByAltText: (alt: string) => Promise<HTMLElement[]>;
    findAllByDisplayValue: (value: string) => Promise<HTMLElement[]>;
    findAllByTestId: (testId: string) => Promise<HTMLElement[]>;
  };

  // render 함수 타입
  export function render(
    ui: ReactElement,
    options?: {
      container?: HTMLElement;
      baseElement?: HTMLElement;
      hydrate?: boolean;
      wrapper?: React.ComponentType<{children: ReactElement}>;
    }
  ): {
    container: HTMLElement;
    baseElement: HTMLElement;
    debug: (baseElement?: HTMLElement | HTMLElement[]) => void;
    unmount: () => boolean;
    rerender: (ui: ReactElement) => void;
    asFragment: () => DocumentFragment;
  } & typeof screen;
} 