import httpService from '../../common/httpService'
import {userBirthday} from '../../filters'

const state = {
    user: { name: "张豆豆", idnumber: "" },
    userList: { list: [] },
    userDetail: {}
}

// getters
const getters = {
    user: state => state.user,
    userList: state => state.userList,
    userDetail: state => state.userDetail
}

// actions
const actions = {
    updateUserScore({ commit, state }, param) {
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
    getUserList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    commit('initUserList', res);
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
    },
    getUserDetail({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('initUserDetail', param);
            resolve();
        })
    }
}

// mutations
const mutations = {
    initUser(state, res) {
        state.user = res.biz_result;
    },
    initUserList(state, res) {
        state.userList = res.biz_result;
    },
    initUserDetail(state, res) {  
        // 处理下用户生日       
        // res.birthday = filters.timeAgo(res.birthday);
        state.userDetail = state.userList.list.find((item) => item.id == res);
        if(state.userDetail.birthday){
            state.userDetail.birthday = userBirthday(state.userDetail.birthday * 1000);
        }else{
            state.userDetail.birthday = '';
        }      
        
         
        
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
