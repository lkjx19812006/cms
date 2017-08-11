import httpService from '../../common/httpService'
import config from '../../common/common.config.json'
// initial state
const state = {
    sendUserList: { list: [] },
    blackList: {list:[]}

}

// getters
const getters = {
    sendUserList: state => state.sendUserList,
    blackList: state => state.blackList
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
    getBlackList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    resolve(res);
                    commit('setBlackList', res);
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
    setBlackList(state, res) {
        state.blackList = res.biz_result;
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
