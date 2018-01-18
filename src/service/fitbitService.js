import {AsyncStorage} from 'react-native'
import {btoa} from 'util/Base64'
import {AuthSession} from 'expo'
import {kgToLbs} from 'util/UnitsUtil'
import FetchError from 'service/FetchError'

export const ACCESS_TOKEN_FITBIT = 'fitbit_accessToken'
export const USER_ID_FITBIT = 'fitbit_userId'
export const REFRESH_TOKEN_FITBIT = 'fitbit_refreshToken'
export const FITBIT_CLIENT_ID = '22CQ77'
const FITBIT_CLIENT_SECRET = 'd006ce8c5ca56a1da89440bab320766c'

let LATEST_ACCESS_TOKEN = null
let LAST_REFRESH_DATE = null
let TOKEN_EXPIRY_MS = 28800 * 1000 //8 hours

/**
 * FOR TESTING ONLU
 */
export function setAccessTokenForTest(token) {
    LATEST_ACCESS_TOKEN = token
}

export function getBasicAuthHeader() {
    console.log('get basic fitbit auth header ')
    return `Basic ${btoa(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`)}`
}

export async function persistFitbitCredentials({accessToken, userId, refreshToken}) {
    console.log('attempting to persist credentials', accessToken, userId, refreshToken)
    if (!accessToken || !userId || !refreshToken) {
        console.error('You must provide values for accessToken, userId, and refreshToken. At least was was not provided.')
        throw new Error('You must provide values for accessToken, userId, and refreshToken. At least was was not provided.')
    }
    try {
        let response = await AsyncStorage.multiSet([
            ['fitbit_accessToken', accessToken],
            ['fitbit_userId', userId],
            ['fitbit_refreshToken', refreshToken]
        ])
        console.log('response from setting tokens', response)
        LATEST_ACCESS_TOKEN = accessToken
        LAST_REFRESH_DATE = new Date().getTime()
        return true
    } catch (e) {
        console.error('failed to persist fitbit credentials', e)
        return false
    }
}

export async function getFitbitAccessToken() {
    try {
        if (LATEST_ACCESS_TOKEN) {
            return LATEST_ACCESS_TOKEN
        }

        let accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_FITBIT)
        console.log('retrieved access token from AsyncStorage, checking if valid', accessToken)

        if (!accessToken) {
            console.warn('No access token found - you may need to log in')
            return null
        }

        let isActive = await isActiveAccessToken(accessToken)
        if (!isActive) {
            console.log('token was NOT valid, refreshing it')
            let refreshResult = await refreshAccessToken()
            console.log('refresh token result', refreshResult)
            accessToken = refreshResult.accessToken
        } else {
            LATEST_ACCESS_TOKEN = accessToken
        }

        return accessToken
    } catch (e) {
        console.error('could not get fitbit access token from cache')
        return null
    }
}

export function getFitbitRefreshToken() {
    return AsyncStorage.getItem(REFRESH_TOKEN_FITBIT).then(refreshToken => {
        console.log('retrieved refresh token from AsyncStorage', refreshToken)
        return refreshToken
    })
}

/**
 * Default is expiry in 8 hours
 * @returns {Promise<any>}
 */
export async function refreshAccessToken() {
    console.log('refreshing current access token')
    let [[, accessToken], [, refreshToken]] = await AsyncStorage.multiGet([ACCESS_TOKEN_FITBIT, REFRESH_TOKEN_FITBIT])
    console.log('retrieved accessToken and refreshToken from AsyncStorage', accessToken, refreshToken)

    let url = 'https://api.fitbit.com/oauth2/token' +
        '?grant_type=refresh_token' +
        `&refresh_token=${refreshToken}`

    let authHeader = getBasicAuthHeader()

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
        let {
            access_token,
            refresh_token,
            expires_in,
            user_id,
            token_type,
        } = await response.json()
        console.log('refreshed token', access_token, refresh_token)
        let persistSuccess = await persistFitbitCredentials({
            accessToken: access_token,
            refreshToken: refresh_token,
            userId: user_id
        })
        console.log('persisted tokens successfully', persistSuccess)
        return {accessToken: access_token, refreshToken: refresh_token}
    } catch (e) {
        console.error('failed to refresh the token', e)
        return {error: e}
    }

}

async function isActiveAccessToken(accessToken) {
    console.log('introspecting access token', accessToken)
    let url = 'https://api.fitbit.com/oauth2/introspect'
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `token=${accessToken}`
        })
        let responseJson = await response.json()
        console.log('got token info', responseJson)
        let {active} = responseJson
        if (active === 1) {
            return true
        }
        return false

    } catch (e) {
        console.error('failed to verify access token', e)
        return false
    }
}

export async function exchangeFitbitCodeForAuthToken(code) {
    console.log('getting fitbit data for code', code)

    let url = 'https://api.fitbit.com/oauth2/token' +
        '?grant_type=authorization_code' +
        `&client_id=${FITBIT_CLIENT_ID}` +
        `&redirect_uri=${getRedirectUri()}` +
        `&code=${code}`
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': getBasicAuthHeader(),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })

        let responseJson = await response.json()
        console.log('got response from code auth token exchange', responseJson)
        let {access_token, refresh_token, expires_in, user_id, token_type} = responseJson
        try {
            await persistFitbitCredentials({accessToken: access_token, refreshToken: refresh_token, userId: user_id})
        } catch (e) {
            console.log('failed to persist fitbit credentials, continuing anyway')
        }

        return {
            accessToken: access_token,
            refreshToken: refresh_token,
            userId: user_id
        }
    }
    catch (e) {
        console.error('failed to exchange code for token', e)
        return new Error({message: 'Failed to exchange code for token', error: e})
    }
}

export async function login() {
    try {
        console.log('starting fitbit login flow')

        let redirectUrl = AuthSession.getRedirectUrl()
        console.log('redirect uri', redirectUrl)

        let authUrl = 'https://www.fitbit.com/oauth2/authorize' +
            `?client_id=${FITBIT_CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
            '&response_type=code' +
            `&scope=${encodeURIComponent('weight heartrate sleep profile activity nutrition')}`
        console.log('authUrl', authUrl)

        let result = await AuthSession.startAsync({authUrl})
        console.log('got auth result', result)

        if (result.errorCode) {
            return Promise.reject({error: result.errorCode})
        }
        let {code} = result.params
        return await exchangeFitbitCodeForAuthToken(code, redirectUrl)
    } catch (e) {
        console.error('failed to get auth info ', e)
        return new Error({error: e, message: 'failed to authenticate'})
    }

}

export async function fetchWeightForDay(dayKey) {
    // let accessToken = state.user.getIn(['fitbit', 'accessToken'])
    try {
        if (!dayKey) {
            return null
        }

        //response will always be present, or else an error would have been thrown
        let response = await authorizedRequest({
            url: `https://api.fitbit.com/1/user/-/body/log/weight/date/${dayKey}.json`,
            method: 'GET'
        })

        console.log('day weight response', response)
        if (response.weight.length > 0) {
            return kgToLbs(response.weight[0].weight)
        }

    } catch (e) {
        console.error('something went wrong while fetching the weight for day', dayKey, e)
        return null
    }
}


function getRedirectUri() {
    return AuthSession.getRedirectUrl()
}


async function isTokenExpiredResponse(response) {
    if (response.status === 401) {
        let json = await response.json()
        if (json.errors && json.errors.length > 0) {
            return json.errors.some(error => error.errorType === 'expired_token')
        }
    }
    return false
}

export async function authorizedRequest({url, method = 'GET', headers = {}}) {
    if (!url) {
        throw new FetchError({message: 'No URL provided', status: 400})
    }

    let accessToken = await getFitbitAccessToken()
    if (!accessToken) {
        console.log('no accessToken present')
        throw new FetchError({
            message: 'Unauthorized, no token present for the request',
            status: 401,
            loginRequired: true
        })
    }

    let response = null
    try {
        response = await fetch(`${url}`, {
            method,
            headers: {
                ...headers,
                'Authorization': `Bearer ${accessToken}`
            }
        })
    } catch (e) {
        console.error('Something unexpected went wrong with the fitbit authorized request', e)
        throw new FetchError({message: `failed to do authorized fitbit request: ${e.message}`, status: 500})
    }

    if (response && response.ok) {
        return await response.json()
    } else {
        console.error('The authorized fitbit request failed', response)
        throw new FetchError({status: response.status, message: response.statusText})
    }
}

// export function fetchWeightForDay()