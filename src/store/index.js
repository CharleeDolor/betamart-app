import { createStore } from 'vuex'

export default createStore({
  state: {
    products: [],
    accountDetails: [],
    
  },
  getters: {
    getAccountDetails(state){
      return state.accountDetails;
    },
  },
  mutations: {
    loadAccountDetails(state, payload){
      state.accountDetails = payload
    },

  },
  actions: {
    asyncLoadAccountDetails(context, payload){
      setTimeout(() => {
        context.commit('loadAccountDetails', payload);
      });
    }
  },
  modules: {
  }
})
