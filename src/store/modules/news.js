import httpService from '../../common/httpService'


const state = {
    newsList: {list:[]}
}

// getters
const getters = {
    news: state => state.newsList
}

// actions
const actions = {
    getNews({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    commit('initNews', res);
                    resolve(res);
                },
                function(err) {
                    reject(err);
                })
        })
    },
    pushNews({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    resolve(res);
                },
                function(err) {
                    reject(err);
                })
        })
    },
}

// mutations
const mutations = {
	initNews(state, res) {
        state.newsList = res.biz_result;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
