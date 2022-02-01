import { get } from "lodash";

export const queryString = {
  get(key: string) {
    return get(this.parse(), key)
  },
  parse(query: string = location.search.substring(1)) {
    return Object.fromEntries(
      new URLSearchParams(query)
    )
  },
  stringify(object: object) {
    const params = new URLSearchParams();
    Object
      .entries(object)
      .forEach(([key, value]: [string, any]) => {
        params.append(key, value)
      })
    return params.toString()
  }
}