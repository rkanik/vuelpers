import api from '@/api'
import Vue from 'vue'
import Vuex, { createLogger, useVuex } from './useVuex'
import { encodedCookies } from '../../../lib'
import { sleep } from '../../../lib'
import {
	SET,
	importModules,
	handleAction,
	createGetters,
	createMutations,
} from '../../../lib/vuex'

Vue.use(Vuex)

const modules = importModules(
	require.context('./modules', true, /\.store\.(js|ts)$/)
)

const store = useVuex({
	state: {
		isLoading: false,
	},
	getters: createGetters('isLoading'),
	mutations: createMutations(SET),
	actions: {
		async initialize(ctx) {
			ctx.setState({ isLoading: true })

			console.log('initialize', this)

			// commit(SET, { isLoading: true })
			await sleep(3, 'sec')
			ctx.commit(SET, { isLoading: false })
		},
		async fetchTodos({ commit }) {
			commit(SET, { isLoading: true })

			console.log(encodedCookies.get('__name__', 'todos'))

			return handleAction(api.fetchTodos(), (res: any) => {
				console.log('fetchTodos', res)

				encodedCookies.set([
					{ key: '__name__', value: 'RK Anik' },
					{ key: 'todos', value: res.data },
				])

				commit(SET, { isLoading: false })
			})
		},
	},
	modules,
	plugins: [createLogger()],
})

console.log(store)

export default new Vuex.Store(store)
