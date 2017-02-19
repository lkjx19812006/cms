

// initial state
const state = {
    all: []
}

// getters
const getters = {
    allProducts: state => state.all
}

// actions
const actions = {
    TEST({ commit }) {
        return new Promise((resolve, reject) => {
           resolve(['fdsdf']);
        })
    }
}

// mutations
const mutations = {
    
}

export default {
    state,
    getters,
    actions,
    mutations
}
