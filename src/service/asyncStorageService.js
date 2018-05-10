import {AsyncStorage} from 'react-native'

const GOOGLE_AUTH_KEY = 'google_auth'
const USER_ID_KEY = '@user_id'

export async function clearKeys() {
    try {
        await AsyncStorage.multiRemove([GOOGLE_AUTH_KEY, USER_ID_KEY])
    }
    catch (e) {
        console.error('failed to erase async keys', e)
    }
}

export async function saveGoogleAuth(creds) {
    try {
        await AsyncStorage.setItem(GOOGLE_AUTH_KEY, JSON.stringify(creds))
        console.log('successfully set google auth credentials')
    } catch (e) {
        console.error('failed to save google credentials', e)
    }
}

export async function saveUserId(userId) {
    try {
        await AsyncStorage.setItem(USER_ID_KEY, userId)
    } catch (e) {
        console.error('failed to save user_id to async storage', e)
    }
}

export async function fetchUserId() {
    try {
        const userId = await AsyncStorage.getItem(USER_ID_KEY)
        if (userId) {
            console.log('found user id in async storage')
            return userId
        } else {
            console.log('no user id found in async storage')
        }
    } catch (e) {
        console.error('error fetching user id from async storage', e)
    }
}

export async function fetchGoogleAuth() {
    try {
        const value = await AsyncStorage.getItem(GOOGLE_AUTH_KEY)
        if (value) {
            console.log('successfully fetch google auth from async storage', value)
            return JSON.parse(value)
        } else {
            console.log('no value found for google creds')
        }
    }
    catch (e) {
        console.error('failed to fetch google auth', e)
        return null
    }
}