import httpService from '../../common/httpService'
import config from '../../common/common.config.json'
// initial state
// shape: [{ id, quantity }]
const state = {
    marketInfoList: { list: [] },
    total: 0,
    ppl: { list: [] }
}

// getters
const getters = {
    marketInfoList: state => state.marketInfoList,
    total: state => state.total,
    ppl: state => state.total
}

// actions
const actions = {
    getMarketInfoList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    commit('getMarketInfoList', res);
                    // commit('formatOnShell');
                    resolve(res);
                },
                function(err) {
                    reject(err);
                })
        })
    },
    getChangePrice({ commit, state }, param) {
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
    //修改本地价钱
    changeLocalPrice({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('changePrice', param);
            resolve();
        })
    },
    getMarketInfoPpl({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    commit('marketInfoinitPpl', res);
                    resolve(res);
                },
                function(err) {
                    reject(err);
                })
        })
    },
    //市场行情置顶
    marketTop({ commit, state }, param) {
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
    getMarketInfoList(state, res) {
        state.marketInfoList = res.biz_result;
        state.total = res.biz_result.total;
    },
    marketInfoinitPpl(state, res) {
        for (let i = 0; i < res.biz_result.list.length; i++) {
            let item = res.biz_result.list[i];
            item.value = item.keyWord;
        }
        state.ppl = res.biz_result;
    },
    // 本地缓存价格 防止刷新
    changePrice(state, res) {
        let id = res.id;
        let unitprice = res.unitprice;
        let flag = false;
        let plen = state.marketInfoList.list.length;
        for (let i = 0; i < plen; i++) {
            let obj = state.marketInfoList.list[i];
            if (obj.id === id) {
                obj.unitprice = unitprice;
                break;
            } else {
                for (let i = 0; i < obj.list.length; i++) {
                    let item = obj.list[i];
                    console.log(item.id, id)
                    if (item.id === id) {
                        item.unitprice = unitprice;
                        flag = true;
                        break;
                    }
                }
            }
            if (flag) {
                break;
            }
        }
    }

}

export default {
    state,
    getters,
    actions,
    mutations
}
