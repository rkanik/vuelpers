import axios from "axios";
import { AxiosRequestConfig } from "axios";
import { has, isArray, isPlainObject } from "lodash";
import { convertKeysToCamelCase, convertKeysToSnakeCase } from "./objects";
import { Cases } from "./types";

const ensureCase = (data: any, caseType: Cases) => {
  if (caseType === "camelCase") return convertKeysToCamelCase(data);
  if (caseType === "snake_case") return convertKeysToSnakeCase(data);
  return data;
};

const toSuccess = (res: any) => {
  if (isPlainObject(res) && res.status === "error") return toError(res);
  let mRes = isArray(res) ? { data: res } : { ...res };
  delete mRes.code;
  delete mRes.status;
  let data = {
    ...mRes,
    statusCode: res.code,
    statusText: res.status,
    message: res.message || "Request succeeded",
  };
  return data;
};

const toError = (error: any) => {
  try {
    let data: any = {};
    if (error.response) {
      const res = error.response;
      data = {
        ...res,
        statusCode: res.status,
        statusText: res.statusText || res.data.status,
      };
      if (res.data.errors)
        data.errors = Object.entries(res.data.errors).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: value,
          }),
          {}
        );
      data.message = res.data.message || res.message;
      data.ref = error.response;
    } else {
      data.statusCode = error.status;
      data.statusText = error.statusText;
      data.message = error.data.message;
      if (error.data.errors) data.errors = error.data.errors;
    }
    data.message = data.message || error.message;
    return data;
  } catch (_) {
    return error;
  }
};

const handler = (requestPromise: Promise<any>, caseType: Cases) => {
  return new Promise((resolve) => {
    requestPromise
      .then((res) => resolve([null, ensureCase(toSuccess(res.data), caseType)]))
      .catch((error) => {
        resolve([ensureCase(toError(error.response || error), caseType)]);
      });
  });
};

type AxiosMiddleware = (
  config: AxiosRequestConfig<any>
) => AxiosRequestConfig<any>;

interface APIConfig {
  baseURL: string;
  response?: {
    convertCase?: Cases;
  };
  request?: {
    convertCase?: Cases;
  };
}

export const createAPI = (config: APIConfig) => {
  // CONFIG
  const mConfig: Required<APIConfig> = {
    request: {
      convertCase: null,
    },
    response: {
      convertCase: null,
    },
    ...config,
  };

  // AXIOS INSTANCE
  const api = axios.create({
    baseURL: mConfig.baseURL,
  });

  // MIDDLEWARES
  let middlewares: AxiosMiddleware[] = [];

  // REQUEST MIDDLEWARE
  api.interceptors.request.use((conf) => {
    for (let middleware of middlewares) {
      conf = { ...middleware(conf) };
    }
    return conf;
  });

  return {
    instance: api,
    use(middleware: AxiosMiddleware) {
      middlewares.push(middleware);
      return this;
    },
    setHeaders(headers: object) {
      api.defaults.headers.common = {
        ...api.defaults.headers.common,
        ...headers,
      };
    },
    removeHeaders(...headers: string[]) {
      for (let key of headers) {
        if (has(api.defaults.headers.common, key)) {
          delete api.defaults.headers.common[key];
        }
      }
    },
    get(endpoint: string, query = {}) {
      return handler(
        api.get(endpoint, {
          params: ensureCase(query, config.request?.convertCase),
        }),
        config.response?.convertCase
      );
    },
    post(endpoint: string, body: object, query = {}) {
      return handler(
        api.post(endpoint, ensureCase(body, config.request?.convertCase), {
          params: ensureCase(query, config.request?.convertCase),
        }),
        config.response?.convertCase
      );
    },
    put(endpoint: string, body: object, query = {}) {
      return handler(
        api.put(endpoint, ensureCase(body, config.request?.convertCase), {
          params: ensureCase(query, config.request?.convertCase),
        }),
        config.response?.convertCase
      );
    },
    patch(endpoint: string, body: object, query = {}) {
      return handler(
        api.patch(endpoint, ensureCase(body, config.request?.convertCase), {
          params: ensureCase(query, config.request?.convertCase),
        }),
        config.response?.convertCase
      );
    },
    delete(endpoint: string) {
      return handler(api.delete(endpoint), config.response?.convertCase);
    },
  };
};
