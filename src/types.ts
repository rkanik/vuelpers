import Vue from 'vue'

// ========================================================
// VUEX
// ========================================================
type PayloadArr<State> = Partial<{
	[K in keyof PickArrays<State>]:
		| ArrayElement<State[K]>
		| {
				item?: ArrayElement<State[K]>
				items?: State[K]
				matchBy?: keyof ArrayElement<State[K]>
		  }
}>

type PathImpl<T, K extends keyof T> = K extends string
	? T[K] extends Record<string, any>
		? T[K] extends ArrayLike<any>
			?
					| K
					| `${K}.${
							| PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>
							| (keyof ArrayElement<T[K]> extends string
									? `index.${keyof ArrayElement<T[K]>}`
									: `index.path`)}`
			: K | `${K}.${PathImpl<T[K], keyof T[K]>}`
		: K
	: never

type Path<T> = PathImpl<T, keyof T> | keyof T

type PathValue<T, P extends Path<T>> = P extends `${infer K}.${infer Rest}`
	? K extends keyof T
		? Rest extends Path<T[K]>
			? PathValue<T[K], Rest>
			: never
		: never
	: P extends keyof T
	? T[P]
	: never

type PayloadSet<State> =
	| Partial<{
			[K in Path<State>]: PathValue<State, K>
	  }>
	| { [key: string]: any }

export type Payload<State> = {
	SET: PayloadSet<State>
	PUSH: PayloadArr<State>
	MERGE: PayloadArr<State>
	UNSHIFT: PayloadArr<State>
}

export type MutationType = keyof Payload<any>

// ========================================================
// END VUEX
// ========================================================

export type FilteredKeys<T, U> = {
	[P in keyof T]: T[P] extends U ? P : never
}[keyof T]

export type FilteredValues<T, U> = { [K in FilteredKeys<T, U>]: T[K] }
export type PickArrays<T> = FilteredValues<T, unknown[]>

export type ArrayElement<ArrayType> =
	ArrayType extends readonly (infer ElementType)[] ? ElementType : never

export type AnyRecord = Record<string, unknown>
export type AnyObject = {
	[key: string]: unknown
}

export type Cases = 'camelCase' | 'snake_case' | null | undefined
export type TextCase = 'camelCase' | 'snake_case'
export type VRef = Vue | Element | (Vue | Element)[] | undefined
