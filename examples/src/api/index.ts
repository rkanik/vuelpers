import { createAPI } from "../../../lib"

const api = createAPI({ baseURL: 'https://todos-json-server.herokuapp.com' })

export default {
	fetchTodos() {
		return api.get('/todos')
	}
}