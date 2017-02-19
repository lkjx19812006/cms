import common from '../../common/common'
import httpService from '../../common/httpService'
// initial state
// shape: [{ id, quantity }]
const state = {
    needList: [],
    resourceList: [],
    checkoutStatus: null
}

// getters
const getters = {
    checkoutStatus: state => state.checkoutStatus,
    needList: state => state.needList,
    resourceList: state => state.resourceList
}

// actions
const actions = {
    getResourceList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(common.urlCommon + common.apiUrl.most, param,
                function(res) {
                    resolve(res);
                    state.resourceList=res.biz_result.list;
                },
                function(err) {
                    reject(err);
                })
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
