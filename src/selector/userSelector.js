import {fetchUserId} from 'service/asyncStorageService'

export async function getUserId(state) {
    if (!state) {
        console.error('YOU MUST PROVIDE STATE TO getUserId selector')
    }
    let userId = state.user.get('userId')
    if (userId) {
        console.log('found user id in state', userId)
        return userId
    }
    userId = await fetchUserId()
    console.log('found user id = ', userId)
    return userId
}

export function isLoggedIn(state) {
    return !!state.user.get('userId')
}

export function isLoggingIn(state) {
    return state.user.get('isLoadingGoogle') || state.user.get('isLoadingGuest') || state.user.get('isFitbitLoading') || state.user.get('isLoadingFirebase')
}

export function getUploadPhotoPref(state) {
    return state.user.get('imageUploadEnabled', false)
}