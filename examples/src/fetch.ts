import { FetchAPI } from '../../lib/fetch'

const fetch = new FetchAPI({
	baseURL: 'http://localhost:8000/api/v1',
})

export { fetch }
export default fetch
