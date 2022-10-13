export * from 'vuex'

import Vuex from 'vuex'
import { StoreOptions } from 'vuex'

const useVuex = <S>(store: StoreOptions<S>): StoreOptions<S> => {
	if (store.mutations) {
		store.mutations.setState = (state, payload: Partial<S>) => {
			Object.entries(payload).forEach(([key, value]) => {
				state[key] = value
			})
		}
	}

	if (store.actions) {
		store.actions = Object.entries(store.actions).reduce(
			(actions, [name, action]: any) => {
				if (typeof action === 'function') {
					actions[name] = async function (ctx, payload) {
						ctx.setState = (payload: any) => {
							ctx.commit('setState', payload)
						}
						action = action.bind(this)
						return action(ctx, payload)
					}
				}
				return actions
			},
			store.actions
		)
	}

	return store
}

export { useVuex }
export default Vuex
