/*
 * @Author: your name
 * @Date: 2020-05-09 17:46:47
 * @LastEditTime: 2020-05-09 18:09:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\fitness-admin\src\store\modules\dict.js
 */
import vue from 'vue'

const dict = {
    state: {
        stateName: [{
            key: 1,
            name: '正常'
        }, {
            key: 2,
            name: '取消待审核'
        }, {
            key: 3,
            name: '已取消'
        }]
    },
    mutations: {
        UPDATE_DATA: (state, payload) => {
            for (var key in payload) {
                console.log(state, key, payload[key])
                vue.set(state, key, payload[key])
            }
        }
    },
    actions: {
        initDict ({ commit, state }, payload) {
            return new Promise((resolve, reject) => {
                const dictApis = []
                console.log(payload.$api)
                for (var key in payload.$api) {
                    dictApis.push({
                        api: payload.$api[key](),
                        key
                    })
                }
                console.log('第一次', dictApis)
                const promiseApis = dictApis.map(d => {
                    return d.api
                })
                Promise.all(promiseApis).then(res => {
                    console.log('allpromise 返回', res)
                    res.forEach((r, i) => {
                        commit('UPDATE_DATA', { [dictApis[i].key]: r })
                        // dict[dictApis[i].key] = r.data || r
                    })
                })
                // if (!state[payload]) {
                //     api.base.dictionaryData(payload).then(res => {
                //         commit('UPDATE_DATA', { [payload]: res.data })
                //         resolve(res.data)
                //     }).catch(err => {
                //         reject(err)
                //     })
                // } else {
                //     resolve(state[payload])
                // }
            })
        }
    }
}

export default dict
