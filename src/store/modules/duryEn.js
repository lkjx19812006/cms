import httpService from '../../common/httpService'
import config from '../../common/common.config.json'
// initial state
const state = {
    hotBreedList: { list: [] },

}

// getters
const getters = {
    hotBreedList: state => state.hotBreedList,
}

// actions
const actions = {
    getHotBreedList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    resolve(res);
                    commit('initHotBreedList', res);
                },
                function(err) {
                    reject(err);
                })
        })
    },
    updateHotSearchImage({ commit, state }, param) {
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
    hotSearchSortTop({ commit, state }, param) {
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
    initHotBreedList(state, res) {
        state.hotBreedList = res.biz_result;
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
