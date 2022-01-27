export const queryString = {
  parse(query: string) {
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