import { isArray, isObject } from 'lodash'
import { Cases } from './types'
import { jsonParse } from './common'
import { queryString } from './query-string'
import { convertKeysToCamelCase, convertKeysToSnakeCase } from './objects'

type FetchAPIConfig = {
	baseURL: string
	response: {
		convertCase: Cases
	}
	request: {
		convertCase: Cases
	}
}

export type FetchResponse = {
	status: number | 'net'
	statusText: string
	message?: string
	ref: () => any
	[key: string]: any
}

export type FetchListener = (
	response: [boolean, FetchResponse],
	meta?: { [key: string]: any }
) => void

export class FetchAPI {
	private headers: any
	private baseURL: string
	private init: RequestInit = {
		mode: 'cors',
		cache: 'default',
	}
	private listeners: FetchListener[] = []

	private config: FetchAPIConfig = {
		baseURL: '',
		request: {
			convertCase: null,
		},
		response: {
			convertCase: null,
		},
	}

	constructor(config: Partial<FetchAPIConfig>, init?: RequestInit) {
		this.baseURL = config.baseURL || ''

		// CONFIG
		this.config = {
			...this.config,
			baseURL: config.baseURL || this.config.baseURL,
		}
		if (config.request && config.request.convertCase) {
			this.config.request.convertCase = config.request.convertCase
		}
		if (config.response && config.response.convertCase) {
			this.config.response.convertCase = config.response.convertCase
		}

		if (init) this.init = { ...this.init, ...init }
		this.headers = { Accept: 'application/json' }
	}

	private ensureCase(data: any, caseType: Cases) {
		if (caseType === 'camelCase') return convertKeysToCamelCase(data)
		if (caseType === 'snake_case') return convertKeysToSnakeCase(data)
		return data
	}

	private getUrl(endpoint: string, query?: object) {
		// If there is no query
		if (!query) return `${this.baseURL}${endpoint}`

		// converting query to snake case if api is in snake case
		query = this.ensureCase(query, this.config.request.convertCase)

		// returning formatted url
		return `${this.baseURL}${endpoint}?${queryString.stringify(
			query as object
		)}`
	}

	private handleFetch(
		promise: Promise<Response>,
		meta?: { [key: string]: any }
	): Promise<[boolean, FetchResponse]> {
		let response: FetchResponse = {
			status: 'net',
			ref: () => {},
			statusText: 'ERR_CONNECTION_REFUSED',
		}
		return new Promise((resolve) => {
			let isResolved = false
			const onResolve = (data: [boolean, FetchResponse]) => {
				// Aleady resolved
				if (isResolved) return

				// Resolve with the response
				resolve(data)

				// Calling the listeners
				this.listeners.forEach((listener) => listener(data, meta))

				// Setting resolved to true
				isResolved = true
			}
			return promise
				.then((raw) => {
					// Saving the status
					response.status = raw.status
					response.statusText = raw.statusText
					response.ref = () => raw

					// Sending json response
					if (raw.ok) return raw.json()

					// Parsing error text
					return raw.text().then((text) => {
						// Parsing error text
						let [err, errParsed] = jsonParse(text)

						// Still text
						if (!err && !isObject(errParsed)) {
							response.message = errParsed
							return onResolve([true, response])
						}

						// Error body is plain text
						if (err) throw new Error(text)

						// Erorr body is object
						response = { ...response, ...errParsed }
						return onResolve([true, response])
					})
				})
				.then((json) => {
					if (!isObject(json)) {
						response.data = json
						return onResolve([false, response])
					}
					// Converting to camelCase if api is in snake_case
					json = this.ensureCase(json, this.config.response.convertCase)

					if (isArray(json)) response.data = json
					//
					else {
						response = { ...response, ...json }
					}

					// Sending success response
					return onResolve([false, response])
				})
				.catch((err) => {
					// Sending error response
					response.ref = () => err
					response.message = err.message
					return onResolve([true, response])
				})
		})
	}

	public parseHeaders(headers: Headers) {
		const parsed: any = {}
		headers.forEach((value, key) => {
			parsed[key] = value
		})
		return parsed
	}

	private getHeaders() {
		const headers = new Headers()
		Object.entries(this.headers).forEach(([key, value]: any) => {
			headers.append(key, value)
		})
		return headers
	}

	public setHeaders(headers: object) {
		this.headers = {
			...this.headers,
			...headers,
		}
	}

	public subscribe(listener: FetchListener): () => void {
		if (!this.listeners.includes(listener)) {
			this.listeners.push(listener)
		}
		return () => this.unsubscribe(listener)
	}

	public unsubscribe(listener: FetchListener) {
		const index = this.listeners.indexOf(listener)
		if (index !== -1) this.listeners.splice(index, 1)
	}

	public removeHeaders(...keys: string[]) {
		keys.forEach((key) => {
			delete this.headers[key]
		})
	}

	public toCallback = async (
		request: Promise<[boolean, FetchResponse]>,
		callback?: (res: [boolean, FetchResponse]) => void
	) => {
		const res = await request
		if (callback) callback(res)
		return res
	}

	public get(endpoint: string, query?: object) {
		const input = this.getUrl(endpoint, query)
		const headers = this.getHeaders()
		return this.handleFetch(
			fetch(input, {
				headers,
				method: 'GET',
			}),
			{ input }
		)
	}

	public post(endpoint: string, body: any, query?: object) {
		const input = this.getUrl(endpoint, query)
		const headers = this.getHeaders()
		if (!(body instanceof FormData)) {
			body = this.ensureCase(body, this.config.request.convertCase)
			body = JSON.stringify(body)
			headers.append('Content-Type', 'application/json')
		}
		return this.handleFetch(
			fetch(input, {
				body,
				headers,
				method: 'POST',
			}),
			{ input }
		)
	}

	public patch(endpoint: string, body: any, query?: object) {
		const input = this.getUrl(endpoint, query)
		const headers = this.getHeaders()
		if (!(body instanceof FormData)) {
			body = this.ensureCase(body, this.config.request.convertCase)
			body = JSON.stringify(body)
			headers.append('Content-Type', 'application/json')
		}
		return this.handleFetch(
			fetch(input, {
				body,
				headers,
				method: 'PATCH',
			}),
			{ input }
		)
	}

	public put(endpoint: string, body: any, query?: object) {
		const input = this.getUrl(endpoint, query)
		const headers = this.getHeaders()
		if (!(body instanceof FormData)) {
			body = this.ensureCase(body, this.config.request.convertCase)
			body = JSON.stringify(body)
			headers.append('Content-Type', 'application/json')
		}
		return this.handleFetch(
			fetch(input, {
				body,
				headers,
				method: 'PUT',
			}),
			{ input }
		)
	}

	public delete(endpoint: string) {
		const input = this.getUrl(endpoint)
		const headers = this.getHeaders()
		return this.handleFetch(
			fetch(input, {
				headers,
				method: 'DELETE',
			}),
			{ input }
		)
	}
}
