export type CompareFn<T> = (a: T, b: T) => boolean
export type Match<T> = string | CompareFn<T>
