import Vue from 'vue'
import Vuex from 'vuex'
import { getLocal, setLocal } from '@/utils/storage'
Vue.use(Vuex)
const Token = 'toutiao_tokem'
export default new Vuex.Store({
  state: {
    user: getLocal(Token)
  },
  getters: {},
  mutations: {
    getToken (state, user) {
      state.user = user
      // localStorage.setItem(Token, JSON.stringify(user))
      setLocal(Token, user)
    }
  },
  actions: {},
  modules: {}
})
