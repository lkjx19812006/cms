import httpService from '../../common/httpService'
import config from '../../common/common.config.json'
// initial state
const state = {
    sendUserList: { list: [] },

}

// getters
const getters = {
    sendUserList: state => state.sendUserList,
}

// actions
const actions = {
    getSendUserList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    resolve(res);
                    commit('initSendUserList', res);
                },
                function(err) {
                    reject(err);
                })
        })
    },
}

// mutations
const mutations = {
    initSendUserList(state, res) {
        state.sendUserList = res.biz_result;
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
