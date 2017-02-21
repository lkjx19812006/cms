import httpService from '../../common/httpService'


const state = {
    user: {name:"张豆豆",idnumber:""}
}

// getters
const getters = {
    user: state => state.user
}

// actions
const actions = {
    getUserInformation({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    commit('initUser', res);
                    resolve(res);
                },
                function(err) {
                    reject(err);
                })
        })
    },
    login({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    resolve(res);
                },
                function(err) {
                    reject(err);
                })
        })
    }
}

// mutations
const mutations = {
	initUser(state, res) {
        state.user = res.biz_result;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
