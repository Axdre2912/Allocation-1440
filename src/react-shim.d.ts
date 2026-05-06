declare module 'react' {
  export type DependencyList = readonly unknown[]
  export type SetStateAction<S> = S | ((prevState: S) => S)
  export type Dispatch<A> = (value: A) => void
  export interface MutableRefObject<T> {
    current: T
  }

  export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>]
  export function useEffect(effect: () => void | (() => void), deps?: DependencyList): void
  export function useMemo<T>(factory: () => T, deps: DependencyList): T
  export function useCallback<T extends (...args: never[]) => unknown>(callback: T, deps: DependencyList): T
  export function useRef<T>(initialValue: T): MutableRefObject<T>

  const React: {
    StrictMode: any
  }
  export default React
}

declare module 'react-dom/client' {
  export interface Root {
    render(children: unknown): void
  }

  export function createRoot(container: Element | DocumentFragment): Root
}

declare module 'react/jsx-runtime' {
  export const Fragment: unknown
  export function jsx(type: unknown, props: unknown, key?: unknown): unknown
  export function jsxs(type: unknown, props: unknown, key?: unknown): unknown
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: unknown
  }
}
