export * from 'vuex'

import Vuex from 'vuex'
import { Dispatch, Commit, StoreOptions } from 'vuex'

export const useVuex: <S>(store: StoreOptions<S>) => StoreOptions<S>

export interface ActionContext<S, R> {
	dispatch: Dispatch
	commit: Commit
	state: S
	getters: any
	rootState: R
	rootGetters: any
	setState: (payload: Partial<S>) => void
}

export default Vuex
