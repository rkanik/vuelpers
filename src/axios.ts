import axios from 'axios'
import { AxiosRequestConfig } from 'axios'
import { has, isArray, isPlainObject } from 'lodash'
import { convertKeysToCamelCase, convertKeysToSnakeCase } from './objects'

const toSuccess = (res: any) => {
	if (isPlainObject(res) && res.status === 'error') return toError(res)
	let mRes = isArray(res) ? { data: res } : { ...res }
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
	try {
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
	catch (_) { return error }
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
		instance: api,
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
		removeHeaders(...headers: string[]) {
			for (let key of headers) {
				if (has(api.defaults.headers.common, key)) {
					delete api.defaults.headers.common[key]
				}
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
