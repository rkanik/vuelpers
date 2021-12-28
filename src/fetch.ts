import _ from 'lodash'
import axios, { AxiosRequestConfig } from 'axios'
import { convertKeysToCamelCase, convertKeysToSnakeCase } from './objects'
import { queryString } from './query-string'

const toSuccess = (res: any) => {
  if (_.isPlainObject(res) && res.status === 'error') return toError(res)
  let mRes = _.isArray(res) ? { data: res } : { ...res }
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

type Cases = 'camelCase' | 'snake_case'

type FetchAPIConfig = {
  baseURL: string,
  apiCase?: Cases
}

export class FetchAPI {
  private headers
  private baseURL: string
  private apiCase: Cases = 'snake_case'
  private init: RequestInit = {
    mode: 'cors',
    cache: 'default',
  }

  constructor(config: FetchAPIConfig, init?: RequestInit) {
    this.baseURL = config.baseURL

    if (init) this.init = { ...this.init, ...init }
    if (config.apiCase) this.apiCase = config.apiCase

    this.headers = new Headers()
    this.headers.append('Accept', 'application/json');
  }

  private getUrl(endpoint: string, query?: object | string) {
    if (_.isString(query)) return `${this.baseURL}${endpoint}?${query}`

    if (_.isObject(query)) {
      return `${this.baseURL}${endpoint}?${queryString.stringify(query)}`
    }
    return `${this.baseURL}${endpoint}`
  }

  private toSuccess(res: any) {
    if (_.isPlainObject(res) && res.status === 'error') return toError(res)
    let mRes = _.isArray(res) ? { data: res } : { ...res }
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

  private toError(error: any) {
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

  private handleFetch(fetchPromise: Promise<Response>): Promise<[error: any, response: any]> {
    return new Promise(resolve => {
      fetchPromise
        .then(raw => raw.json())
        .then(res => {
          const data = this.toSuccess(
            this.apiCase === 'snake_case'
              ? convertKeysToCamelCase(res)
              : res
          )
          resolve([null, data])
        })
        .catch(err => {
          const data = this.toError(
            this.apiCase === 'snake_case'
              ? convertKeysToCamelCase(err)
              : err
          )
          resolve([data, null])
        })
    })
  }

  setHeaders(headers: object) {
    Object.entries(headers).forEach(([key, value]) => {
      this.headers.append(key, value)
    })
  }

  removeHeaders(...keys: string[]) {
    keys.forEach(key => {
      this.headers.delete(key)
    })
  }

  get(endpoint: string, query?: object | string) {
    const input = this.getUrl(endpoint, query)
    return this.handleFetch(
      fetch(input, {
        method: 'GET',
        headers: this.headers
      })
    )
  }
}