export function isAppReady(state) {
    return state.config.get('hasLoaded') && !state.config.get('isLoading')
}