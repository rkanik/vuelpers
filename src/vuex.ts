import { get, set, camelCase, isArray, isFunction, isPlainObject, isString } from 'lodash'
import { FetchResponse } from './fetch'

export type Getter<S, R> = (state: S, getters: any, rootState: R, rootGetters: any) => any

export interface GetterTree<S, R> {
	[key: string]: Getter<S, R>
}

type Mutation<S> = (state: S, payload?: any) => any;
interface MutationTree<S> {
	[key: string]: Mutation<S>;
}

interface ModuleTree<R> {
	[key: string]: any;
}

/**
 * @example
 * importModules(
 *    require.context(
 *       "./modules", false, /\.store\.(js|ts)$/
 *    )
 * )
 * 
 * @param context - Require context
 */
export const importModules = <R>(context: any): ModuleTree<R> => {
	const modules: { [k: string]: any } = {};
	context.keys().forEach((filename: string) => {
		const moduleName = camelCase(filename.replace(/(\.\/|\.store\.(js|ts))/g, ""))
		modules[moduleName] = context(filename).default || context(filename)
	})
	return modules
}

type MutationType = 'SET' | 'PUSH' | 'RESET' | 'UNSHIFT' | 'UPDATE' | 'DELETE' | 'MERGE' | 'CONCAT'
const SET = 'SET', PUSH = 'PUSH', RESET = 'RESET', UNSHIFT = 'UNSHIFT', UPDATE = 'UPDATE', DELETE = 'DELETE', MERGE = 'MERGE', CONCAT = 'CONCAT'

const mutations = {
	[SET]: (state: any, payload: any) => {
		if (!isPlainObject(payload)) {
			throw Error('Payload have to be an object')
		}
		Object
			.entries(payload)
			.forEach(([path, value]) => {
				value = typeof value === 'function'
					? value(get(state, path))
					: value
				set(state, path, value)
			})
	},
	[RESET]: (state: any, initialState: any) => {
		mutations.SET(state, initialState)
	},
	[PUSH]: (state: any, payload: any) => {
		if (isArray(payload)) {
			let [path, ...items] = payload
			let target = get(state, path)

			if (!target || !isArray(target)) {
				throw Error('Specified state path not found or property is not an array')
			}

			target.push(...items)
		}
		else if (isPlainObject(payload)) {
			Object.entries(payload).forEach(([path, item]) => {
				let target = get(state, path)

				if (!target || !isArray(target)) {
					throw Error('Specified state path not found or property is not an array')
				}

				let items = isArray(item) ? item : [item]
				target.push(...items)
			})
		}
		else throw Error('Invalid payload type.')
	},
	[UNSHIFT]: (state: any, payload: any) => {
		if (isArray(payload)) {
			let [path, ...items] = payload
			let target = get(state, path)

			if (!target || !isArray(target)) {
				throw Error('Specified state path not found or property is not an array')
			}

			target.unshift(...items)
		}
		else if (isPlainObject(payload)) {
			Object.entries(payload).forEach(([path, item]) => {
				let target = get(state, path)

				if (!target || !isArray(target)) {
					throw Error('Specified state path not found or property is not an array')
				}

				let items = isArray(item) ? item : [item]
				target.unshift(...items)
			})
		}
		else throw Error('Invalid payload type.')
	},
	[CONCAT]: (state: any, [path, items]: any) => {
		let target = get(state, path)

		if (!target || !isArray(target)) {
			throw Error('Specified state path not found or property is not an array')
		}

		set(state, path, target.concat(items))
	},
	[DELETE]: (state: any, [path, key, match = 'id']: any) => {
		let target = get(state, path)

		if (!target || !isArray(target)) {
			throw Error('Specified state path not found or property is not an array')
		}

		let keys = isArray(key) ? key : [key]
		set(state, path, get(state, path).filter(
			(el: any) => !keys.includes(el[match])
		))
	},
	[UPDATE]: (state: any, [path, data, match = 'id']: any) => {
		let target = get(state, path)

		if (!target || !isArray(target)) {
			throw Error('Specified state path not found or property is not an array')
		}

		set(state, path, get(state, path).map((el: any) => {
			return get(el, match) === get(data, match) ? data : el
		}))
	},
	[MERGE]: (state: any, [path, items, match = 'id']: any) => {
		let target = get(state, path)

		if (!target || !isArray(target)) {
			throw Error('Specified state path not found or property is not an array')
		}

		items.forEach((item: any) => {
			let index = target.findIndex((a: any) => get(a, match) === get(item, match))
			if (index !== -1) target.splice(index, 1, item)
			else target.unshift(item)
		})
	}
}

export const createMutations = <S>(...types: MutationType[]): MutationTree<S> => {
	if (!types.length) return { ...mutations }
	return Object
		.keys(mutations)
		.filter((name) => types.includes(name as MutationType))
		.reduce((m: Partial<typeof mutations>, a: any) => {
			return { ...m, [a]: mutations[a as MutationType] }
		}, {})
};

interface CustomGetterTree<S, R> {
	[key: string]: string | Getter<S, R>
}
export const createGetters = <S = unknown, R = unknown>(
	...keys: (string | CustomGetterTree<S, R>)[]
) => {
	return keys.reduce((getterTree: GetterTree<S, R>, name) => {
		if (isString(name)) {
			getterTree[`$${name}`] = (state: S) => get(state, name)
		}
		if (isPlainObject(name)) {
			Object.entries(name).forEach(([key, path]: [string, any]) => {
				getterTree[`$${key}`] = isString(path)
					? (state: S) => get(state, path) : path
			})
		}
		return getterTree
	}, {})
}

type SuccessResponse = FetchResponse | Record<string, any>
export const handleAction = (apiRequestPromise: Promise<any>, successCallback?: SuccessResponse, errorCallback?: any) => {
	return new Promise(resolve => {
		apiRequestPromise
			.then(([error, response]) => {
				if (!error && isFunction(successCallback)) successCallback(response)
				if (error && isFunction(errorCallback)) errorCallback(error)
				resolve([error, response])
			})
	})
}

export { SET, PUSH, RESET, UNSHIFT, UPDATE, DELETE, MERGE, CONCAT }