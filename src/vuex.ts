import _ from 'lodash'

type MutationType = 'SET' | 'PUSH' | 'RESET' | 'UNSHIFT' | 'UPDATE' | 'DELETE' | 'MERGE' | 'CONCAT'
const SET = 'SET', PUSH = 'PUSH', RESET = 'RESET', UNSHIFT = 'UNSHIFT', UPDATE = 'UPDATE', DELETE = 'DELETE', MERGE = 'MERGE', CONCAT = 'CONCAT'

const mutations = {
	[SET]: (state: any, payload: any) => {
		if (!_.isPlainObject(payload)) {
			throw Error('Payload have to be an object')
		}
		Object
			.entries(payload)
			.forEach(([path, value]) => {
				value = typeof value === 'function'
					? value(_.get(state, path))
					: value
				_.set(state, path, value)
			})
	},
	[RESET]: (state: any, initialState: any) => {
		mutations.SET(state, initialState)
	},
	[PUSH]: (state: any, payload: any) => {
		if (_.isArray(payload)) {
			let [path, ...items] = payload
			let target = _.get(state, path)

			if (!target || !_.isArray(target)) {
				throw Error('Specified state path not found or property is not an array')
			}

			target.push(...items)
		}
		else if (_.isPlainObject(payload)) {
			Object.entries(payload).forEach(([path, item]) => {
				let target = _.get(state, path)

				if (!target || !_.isArray(target)) {
					throw Error('Specified state path not found or property is not an array')
				}

				let items = _.isArray(item) ? item : [item]
				target.push(...items)
			})
		}
		else throw Error('Invalid payload type.')
	},
	[UNSHIFT]: (state: any, payload: any) => {
		if (_.isArray(payload)) {
			let [path, ...items] = payload
			let target = _.get(state, path)

			if (!target || !_.isArray(target)) {
				throw Error('Specified state path not found or property is not an array')
			}

			target.unshift(...items)
		}
		else if (_.isPlainObject(payload)) {
			Object.entries(payload).forEach(([path, item]) => {
				let target = _.get(state, path)

				if (!target || !_.isArray(target)) {
					throw Error('Specified state path not found or property is not an array')
				}

				let items = _.isArray(item) ? item : [item]
				target.unshift(...items)
			})
		}
		else throw Error('Invalid payload type.')
	},
	[CONCAT]: (state: any, [path, items]: any) => {
		let target = _.get(state, path)

		if (!target || !_.isArray(target)) {
			throw Error('Specified state path not found or property is not an array')
		}

		_.set(state, path, target.concat(items))
	},
	[DELETE]: (state: any, [path, key, match = 'id']: any) => {
		let target = _.get(state, path)

		if (!target || !_.isArray(target)) {
			throw Error('Specified state path not found or property is not an array')
		}

		let keys = _.isArray(key) ? key : [key]
		_.set(state, path, _.get(state, path).filter(
			(el: any) => !keys.includes(el[match])
		))
	},
	[UPDATE]: (state: any, [path, data, match = 'id']: any) => {
		let target = _.get(state, path)

		if (!target || !_.isArray(target)) {
			throw Error('Specified state path not found or property is not an array')
		}

		_.set(state, path, _.get(state, path).map((el: any) => {
			return _.get(el, match) === _.get(data, match) ? data : el
		}))
	},
	[MERGE]: (state: any, [path, items, match = 'id']: any) => {
		let target = _.get(state, path)

		if (!target || !_.isArray(target)) {
			throw Error('Specified state path not found or property is not an array')
		}

		items.forEach((item: any) => {
			let index = target.findIndex((a: any) => _.get(a, match) === _.get(item, match))
			if (index !== -1) target.splice(index, 1, item)
			else target.unshift(item)
		})
	}
}

export const createMutations = (...types: MutationType[]) => {
	if (!types.length) return { ...mutations }
	return Object
		.keys(mutations)
		.filter((name) => types.includes(name as MutationType))
		.reduce((m: Partial<typeof mutations>, a: any) => ({ ...m, [a]: mutations[a as MutationType] }), {})
};

export const createGetters = (...getters: string[]) => {
	return getters.reduce((gettersObj: { [key: string]: any }, name: string) => {
		if (typeof name === 'string') {
			gettersObj[`$${name}`] = (state: any) => state[name]
		}
		if (_.isPlainObject(name)) Object.entries(name).forEach(([key, path]: any[]) => {
			gettersObj[`$${key}`] = (state: any) => _.get(state, path)
		})
		return gettersObj
	}, {})
}

export const handleAction = (apiRequestPromise: Promise<any>, successCallback?: any, errorCallback?: any) => {
	return new Promise(resolve => {
		apiRequestPromise
			.then(([error, response]) => {
				if (!error && _.isFunction(successCallback)) successCallback(response)
				if (error && _.isFunction(errorCallback)) errorCallback(error)
				resolve([error, response])
			})
	})
}

export { SET, PUSH, RESET, UNSHIFT, UPDATE, DELETE, MERGE, CONCAT }