import api from '@/api';
import Vue from 'vue'
import Vuex, { createLogger } from 'vuex'
import { sleep } from "../../../lib";
import { SET, createGetters, createMutations, handleAction } from "../../../lib/vuex";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false
  },
  getters: createGetters('isLoading'),
  mutations: createMutations('SET'),
  actions: {
    async initialize({ commit }) {
      commit(SET, { isLoading: true })

      await sleep(3, 'sec')

      commit(SET, { isLoading: false })
    },
    async fetchTodos({ commit }) {
      commit(SET, { isLoading: true })

      return handleAction(api.fetchTodos(), (res: any) => {
        console.log('fetchTodos', res)
        commit(SET, { isLoading: false })
      })
    }
  },
  modules: {
  },
  plugins: [createLogger()]
})
