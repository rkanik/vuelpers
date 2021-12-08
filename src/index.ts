import _ from 'lodash'
import axios, { AxiosRequestConfig } from 'axios'

export { _ }

interface PasswordType {
	length: number
	chars: boolean
	symbols: boolean
	numbers: boolean
}

/**
 *
 * @param {number} time - How much time have to sleep
 * @param {string} unit - Unit of time ['s'-seconds,'m'-minute,'h'-houre]
 */
export const sleep = (time: number, unit: 'sec' | 'min' | 'hr') => new Promise((resolve) => {
	const ms = unit === 'sec'
		? time * 1000 : unit === 'min'
			? time * 60 * 1000 : unit === 'hr'
				? time * 60 * 60 * 1000 : time;
	setTimeout(() => resolve(''), ms);
});

export const miniId = (len: number = 5) => {
	return Math.random()
		.toString(36).slice(len <= 10 ? -len : -10)
}

export const generatePassword = (config: Partial<PasswordType> = {}) => {
	let defaultType: PasswordType = {
		length: 8,
		chars: true,
		numbers: true,
		symbols: false,
		...config
	}
	const
		numbers = '0123456789',
		symbols = "!@#$%^&*()_+><{};:.,",
		chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

	let password = '', sourceString = ''

	if (defaultType.chars) sourceString += chars
	if (defaultType.numbers) sourceString += numbers
	if (defaultType.symbols) sourceString += symbols

	for (var i = 0, n = sourceString.length; i < defaultType.length; ++i) {
		password += sourceString.charAt(Math.floor(Math.random() * n));
	}
	return password;
}

export const getPairs = (array: any[], length: number = 2) => {
	let start = 0, pairs: any = []
	while (start < (array.length - 1)) {
		pairs = pairs.concat(
			[[...Array(length)].map(
				(_, index) => array[start + index]
			)]
		)
		start += 1
	}
	return pairs
}

export const stringReplace = (
	string: string,
	start: number,
	replacement: string,
	end: number = string.length
) => {
	return (
		string.substring(0, start) +
		replacement +
		string.substring(end)
	)
}

export const isEmpty = (v: any) => {
	if ([undefined, null, ''].includes(v)) return true
	if (_.isArray(v) && !v.length) return true
	if (_.isPlainObject(v) && !Object.keys(v).length) return true
	return false
}

/** Encode string to base64 */
export const encodeString = (str: any) => {
	const _unescape = window.unescape || window.decodeURI
	return window.btoa(_unescape(encodeURIComponent(str)))
}

/** Decode base64 to string */
export const decodeString = (encoded: any) => {
	const _escape = window.escape || window.encodeURI
	return decodeURIComponent(_escape(window.atob(encoded)))
}

export const encodedLS = {
	getItem(key: string): any {
		let data = localStorage.getItem(key)
		if (!data) return null

		const [error, parsed] = jsonParse(decodeString(data))
		if (!error) return parsed

		return secureDataType(data)
	},
	setItem(key: string, value: string) {
		localStorage.setItem(
			key, encodeString(JSON.stringify(value))
		)
	},
	removeItem(key: string) {
		localStorage.removeItem(key)
	},
}

export const hasHistory = (): boolean => {
	return window.history.length > 2
}

export const partialObject = (object: any, ...keys: string[]): { [key: string]: any } => {
	return keys.reduce((data: any, key: any) => {
		if (!key) return data
		const splitted = key.split('.')
		if (_.has(object, key)) data[key] = object[key]
		else if (splitted.length > 1 && _.has(object, splitted[0])) {
			data[splitted[0]] = partialObject(
				object[splitted[0]],
				splitted.slice(1).join('.').split(',')
			)
		}
		return data
	}, {})
}

export const changeLocationQuery = (query: string) => {
	if (window.history.pushState) {
		const newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + query
		window.history.pushState({ path: newurl }, '', newurl)
	}
}

export const getCurrentCountry = (): Promise<[country: { code: string, name: string } | null, error: any]> => {
	return new Promise((resolve) => {
		return fetch("https://ip2c.org/s")
			.then((res) => res.text())
			.then((response) => {
				let result = (response || "").toString();
				if (!result || result[0] !== "1") return resolve([null, { message: 'Error while fetching country' }]);
				return resolve([{ code: result.substring(2, 4), name: result.substring(9) }, null]);
			})
			.catch((err) => resolve([err, null]))
	})
}

export const jsonParse = (input: string): [error: boolean, parsed: any] => {
	try {
		const parsed = JSON.parse(input)
		return [false, parsed]
	}
	catch (_) { return [true, null] }
}

export const secureDataType = (input: any) => {

	// Non string
	if (!_.isString(input)) return input

	// Empty string
	if (!input.length) return input

	if (input === 'undefined') return undefined

	// Possible intended string
	if (['0', '+', '-'].some(v => input.startsWith(v))) return input

	// Json encoded
	const [parseError, parsedData] = jsonParse(input)
	if (!parseError) return parsedData

	// try to convert
	const converted = +input
	if (isNaN(converted)) return input

	return converted
}

export const convertKeysToSnakeCase = (data: any): any => {
	const nested = (b: any) => {
		return (_.isArray(b) || _.isPlainObject(b))
			? convertKeysToSnakeCase(b) : b
	}
	if (_.isString(data)) return _.snakeCase(data)
	if (_.isArray(data)) return data.map(nested)
	if (_.isPlainObject(data)) return Object.entries(data)
		.reduce((converted: any, [key, value]: any[]) => {
			key = convertKeysToSnakeCase(key)
			return { ...converted, [key]: nested(value) }
		}, {})
	return data
}

export const convertKeysToCamelCase = (data: any): any => {
	const nested = (b: any) => {
		return (_.isArray(b) || _.isPlainObject(b))
			? convertKeysToCamelCase(b)
			: secureDataType(b)
	}
	if (_.isString(data)) return _.camelCase(data)
	if (_.isArray(data)) { return data.map(nested) }
	if (_.isPlainObject(data)) return Object.entries(data)
		.reduce((converted: any, [key, value]: any[]) => {
			key = convertKeysToCamelCase(key)
			return { ...converted, [key]: nested(value) }
		}, {})
	return data
}

export const toFormData = (value: any, extra: object = {}) => {
	const data = { ...convertKeysToSnakeCase(value), ...extra }
	const formData = new FormData()

	const traverse = (value: any, key?: any) => {
		if (_.isArray(value)) {
			value.forEach((v: any, index) => {
				traverse(v, key ? `${key}[${index}]` : index)
			})
		} else if (_.isPlainObject(value)) {
			Object.entries(value).forEach(([p, v]: any[]) => {
				traverse(v, key ? `${key}[${p}]` : p)
			})
		} else {
			formData.append(key, value)
		}
	}
	traverse(data)
	return formData
}

const toSuccess = (res: any) => {
	if (res.status === 'error') return toError(res)
	let mRes = { ...res }
	delete mRes.code
	delete mRes.status
	let data = {
		...mRes,
		statusCode: res.code,
		statusText: res.status,
		message: res.message || 'Request succeeded'
	}
	return data
}

const toError = (error: any) => {
	let data: any = {}
	if (error.response) {
		const res = error.response
		data = {
			...res,
			statusCode: res.status,
			statusText: res.statusText || res.data.status,
		}
		if (res.data.errors) data.errors = Object
			.entries(res.data.errors)
			.reduce((acc, [key, value]) => ({
				...acc, [key]: value
			}), {})
		data.message = res.data.message || res.message
		data.ref = error.response
	}
	else {
		data.statusCode = error.status
		data.statusText = error.statusText
		data.message = error.data.message
		if (error.data.errors) data.errors = error.data.errors
	}
	data.message = data.message || error.message
	return data
}

const handler = (requestPromise: Promise<any>) => {
	return new Promise(resolve => {
		requestPromise
			.then(res => {
				resolve([
					null, convertKeysToCamelCase(
						toSuccess(res.data)
					)])
			})
			.catch(error => {
				resolve([
					convertKeysToCamelCase(
						toError(error.response || error)
					)])
			})
	})
}

type AxiosMiddleware = (config: AxiosRequestConfig<any>) => AxiosRequestConfig<any>
export const createAPI = (config: { baseURL: string }) => {
	const api = axios.create({ baseURL: config.baseURL })
	let middlewares: AxiosMiddleware[] = []

	api.interceptors.request.use((config) => {
		for (let middleware of middlewares) {
			config = { ...middleware(config) }
		}
		return config
	})

	return {
		use(middleware: AxiosMiddleware) {
			middlewares.push(middleware)
			return this
		},
		setHeaders(headers: object) {
			api.defaults.headers.common = {
				...api.defaults.headers.common,
				...headers
			}
		},
		get(endpoint: string, query = {}) {
			return handler(
				api.get(
					endpoint, {
					params: convertKeysToSnakeCase(query)
				})
			)
		},
		post(endpoint: string, body: object, query = {}) {
			return handler(
				api.post(
					endpoint,
					convertKeysToSnakeCase(body), {
					params: convertKeysToSnakeCase(query)
				})
			)
		},
		put(endpoint: string, body: object, query = {}) {
			return handler(
				api.put(
					endpoint,
					convertKeysToSnakeCase(body), {
					params: convertKeysToSnakeCase(query)
				})
			)
		},
		patch(endpoint: string, body: object, query = {}) {
			return handler(
				api.patch(
					endpoint,
					convertKeysToSnakeCase(body), {
					params: convertKeysToSnakeCase(query)
				})
			)
		},
		delete(endpoint: string) {
			return handler(
				api.delete(endpoint)
			)
		}
	}
}

const mutations: any = {
	SET(state: any, payload: any) {
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
	RESET(state: any, initialState: any) {
		mutations.SET(state, initialState)
	},
	PUSH(state: any, payload: any) {
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
	UNSHIFT(state: any, payload: any) {
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
	CONCAT(state: any, [path, items]: any) {
		let target = _.get(state, path)

		if (!target || !_.isArray(target)) {
			throw Error('Specified state path not found or property is not an array')
		}

		_.set(state, path, target.concat(items))
	},
	DELETE(state: any, [path, key, match = 'id']: any) {
		let target = _.get(state, path)

		if (!target || !_.isArray(target)) {
			throw Error('Specified state path not found or property is not an array')
		}

		let keys = _.isArray(key) ? key : [key]
		_.set(state, path, _.get(state, path).filter(
			(el: any) => !keys.includes(el[match])
		))
	},
	UPDATE(state: any, [path, data, match = 'id']: any) {
		let target = _.get(state, path)

		if (!target || !_.isArray(target)) {
			throw Error('Specified state path not found or property is not an array')
		}

		_.set(state, path, _.get(state, path).map((el: any) => {
			return _.get(el, match) === _.get(data, match) ? data : el
		}))
	},
	MERGE(state: any, [path, items, match = 'id']: any) {
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

export const createMutations = (...types: any[]) => {
	if (!types.length) return { ...mutations }
	return Object
		.keys(mutations)
		.filter(name => types.includes(name))
		.reduce((m, a) => ({ ...m, [a]: mutations[a] }), {})
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

export const handleAction = (apiRequestPromise: Promise<any>, successCallback: any, errorCallback: any) => {
	return new Promise(resolve => {
		apiRequestPromise
			.then(([error, response]) => {
				if (!error && _.isFunction(successCallback)) successCallback(response)
				if (error && _.isFunction(errorCallback)) errorCallback(error)
				resolve([error, response])
			})
	})
}
