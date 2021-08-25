const state = {
    venue: {},
    team: {},
    system: {},
    info: {},
    message: {}
}

const mutations = {
    VENUE: (state, n) => {
        state.venue = n
    },
    TEAM: (state, n) => {
        state.team = n
    },
    SYSTEM: (state, n) => {
        state.system = n
    },
    INFO: (state, n) => {
        state.info = n
    },
    MESSAGE: (state, n) => {
        state.message = n
    }
}

const actions = {
    venue ({ commit }, state) {
        commit('VENUE', state)
    },
    team ({ commit }, state) {
        commit('TEAM', state)
    },
    system ({ commit }, state) {
        commit('SYSTEM', state)
    },
    info ({ commit }, state) {
        commit('INFO', state)
    },
    message ({ commit }, state) {
        commit('MESSAGE', state)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
