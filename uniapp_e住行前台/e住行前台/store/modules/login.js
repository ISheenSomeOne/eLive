const state = {
    isPlay: false
}
const mutations = {
    playPause(state) {
        state.isPlay = !state.isPlay
    }
}
const actions = {

}

export default {
    state,
    actions,
    mutations
}