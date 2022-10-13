import { ActionTree } from 'vuex'

const initialState = () => ({
	loading: false,
})

const state = initialState()
const mutations = {}

const getters = {}

const actions: ActionTree<any, any> = {
	async initialize({ commit }, payload) {
		console.log('initialize', this, payload)
	},
}

export default {
	state,
	getters,
	actions,
	mutations,
	namespaced: true,
}
