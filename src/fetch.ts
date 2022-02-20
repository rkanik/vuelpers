import { jsonParse } from "./common";
import { queryString } from "./query-string";
import { convertKeysToCamelCase, convertKeysToSnakeCase } from "./objects";

type Cases = "camelCase" | "snake_case" | null;

type FetchAPIConfig = {
  baseURL: string;
  response: {
    convertCase: Cases;
  };
  request: {
    convertCase: Cases;
  };
};

export type FetchResponse = {
  status: number | "net";
  statusText: string;
  message?: string;
  [key: string]: any;
};

export class FetchAPI {
  private headers: any;
  private baseURL: string;
  private init: RequestInit = {
    mode: "cors",
    cache: "default",
  };

  private config: FetchAPIConfig = {
    baseURL: "",
    request: {
      convertCase: null,
    },
    response: {
      convertCase: null,
    },
  };

  constructor(config: Partial<FetchAPIConfig>, init?: RequestInit) {
    this.baseURL = config.baseURL || "";

    // CONFIG
    this.config = {
      ...this.config,
      baseURL: config.baseURL || this.config.baseURL,
    };
    if (config.request && config.request.convertCase) {
      this.config.request.convertCase = config.request.convertCase;
    }
    if (config.response && config.response.convertCase) {
      this.config.response.convertCase = config.response.convertCase;
    }

    if (init) this.init = { ...this.init, ...init };
    this.headers = { Accept: "application/json" };
  }

  private ensureCase(data: any, caseType: Cases) {
    if (caseType === "camelCase") return convertKeysToCamelCase(data);
    if (caseType === "snake_case") return convertKeysToSnakeCase(data);
    return data;
  }

  private getUrl(endpoint: string, query?: object) {
    // If there is no query
    if (!query) return `${this.baseURL}${endpoint}`;

    // converting query to snake case if api is in snake case
    query = this.ensureCase(query, this.config.request.convertCase);

    // returning formatted url
    return `${this.baseURL}${endpoint}?${queryString.stringify(
      query as object
    )}`;
  }

  private handleFetch(
    promise: Promise<Response>
  ): Promise<[boolean, FetchResponse]> {
    let response: FetchResponse = {
      status: "net",
      statusText: "ERR_CONNECTION_REFUSED",
    };
    return new Promise((resolve) => {
      return promise
        .then((raw) => {
          // Saving the status
          response.status = raw.status;
          response.statusText = raw.statusText;

          // Sending json response
          if (raw.ok) return raw.json();

          // Parsing error text
          return raw.text().then((text) => {
            // Parsing error text
            let [err, parsedObject] = jsonParse(text);

            // Error body is plain text
            if (err) throw new Error(text);

            // Erorr body is object
            return parsedObject;
          });
        })
        .then((json) => {
          // Converting to camelCase if api is in snake_case
          json = this.ensureCase(json, this.config.response.convertCase);

          // Sending success response
          response = { ...response, ...json };
          return resolve([false, response]);
        })
        .catch((err) => {
          // Sending error response
          response.message = err.message;
          return resolve([true, response]);
        });
    });
  }

  private getHeaders() {
    const headers = new Headers();
    Object.entries(this.headers).forEach(([key, value]: any) => {
      headers.append(key, value);
    });
    return headers;
  }

  public setHeaders(headers: object) {
    this.headers = {
      ...this.headers,
      ...headers,
    };
  }

  public removeHeaders(...keys: string[]) {
    keys.forEach((key) => {
      delete this.headers[key];
    });
  }

  public get(endpoint: string, query?: object) {
    const input = this.getUrl(endpoint, query);
    const headers = this.getHeaders();
    return this.handleFetch(
      fetch(input, {
        headers,
        method: "GET",
      })
    );
  }

  public post(endpoint: string, body: any, query?: object) {
    const input = this.getUrl(endpoint, query);
    const headers = this.getHeaders();
    if (!(body instanceof FormData)) {
      body = this.ensureCase(body, this.config.request.convertCase);
      body = JSON.stringify(body);
      headers.append("Content-Type", "application/json");
    }
    return this.handleFetch(
      fetch(input, {
        body,
        headers,
        method: "POST",
      })
    );
  }

  public patch(endpoint: string, body: any, query?: object) {
    const input = this.getUrl(endpoint, query);
    const headers = this.getHeaders();
    if (!(body instanceof FormData)) {
      body = this.ensureCase(body, this.config.request.convertCase);
      body = JSON.stringify(body);
      headers.append("Content-Type", "application/json");
    }
    return this.handleFetch(
      fetch(input, {
        body,
        headers,
        method: "PATCH",
      })
    );
  }

  public put(endpoint: string, body: any, query?: object) {
    const input = this.getUrl(endpoint, query);
    const headers = this.getHeaders();
    if (!(body instanceof FormData)) {
      body = this.ensureCase(body, this.config.request.convertCase);
      body = JSON.stringify(body);
      headers.append("Content-Type", "application/json");
    }
    return this.handleFetch(
      fetch(input, {
        body,
        headers,
        method: "PUT",
      })
    );
  }

  public delete(endpoint: string) {
    const input = this.getUrl(endpoint);
    const headers = this.getHeaders();
    return this.handleFetch(
      fetch(input, {
        headers,
        method: "DELETE",
      })
    );
  }
}
