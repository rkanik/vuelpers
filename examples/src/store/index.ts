import api from '@/api';
import Vue from 'vue'
import Vuex, { createLogger } from 'vuex'
import { encodedCookies } from "../../../lib";
import { sleep } from "../../../lib";
import {
  SET,
  handleAction,
  createGetters,
  createMutations,
} from "../../../lib/vuex";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false
  },
  getters: createGetters('isLoading'),
  mutations: createMutations(SET),
  actions: {
    async initialize({ commit }) {
      commit(SET, { isLoading: true })

      await sleep(3, 'sec')

      commit(SET, { isLoading: false })
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
    }
  },
  modules: {
  },
  plugins: [createLogger()]
})
