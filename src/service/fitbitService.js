import {AsyncStorage} from 'react-native'
import {btoa} from 'util/Base64'
import {AuthSession} from 'expo'
import {kgToLbs} from 'util/UnitsUtil'
import {addDuration} from 'util/TimeUtil'
import Timeout from 'util/Timeout'
import FetchError from 'service/FetchError'

export const ACCESS_TOKEN_FITBIT = 'fitbit_accessToken'
export const USER_ID_FITBIT = 'fitbit_userId'
export const REFRESH_TOKEN_FITBIT = 'fitbit_refreshToken'
export const FITBIT_CLIENT_ID = '22CQ77'
const FITBIT_CLIENT_SECRET = 'd006ce8c5ca56a1da89440bab320766c'

let IS_REFRESHING_TOKEN = false

let LATEST_ACCESS_TOKEN = null
let LATEST_REFRESH_TOKEN = null
let LAST_REFRESH_DATE = null
let TOKEN_EXPIRY_MS = 28800 * 1000 //8 hours
let ACCESS_TOKEN_EXPIRES_AT = null

/**
 * FOR TESTING ONLU
 */
export function setAccessTokenForTest(token) {
    LATEST_ACCESS_TOKEN = token
}

export async function initialize() {
    try {
        console.log('initializing fitbit service')
        let tokens = await getFitbitAccessToken()
        return tokens
    } catch (e) {
        console.error('failed to initializeApp fitbit service', e)
    }

}

export function getBasicAuthHeader() {
    console.log('get basic fitbit auth header ')
    return `Basic ${btoa(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`)}`
}

export async function persistFitbitCredentials({accessToken, userId, refreshToken}) {
    console.log('attempting to persist credentials')
    // console.log('attempting to persist credentials', accessToken, userId, refreshToken)
    if (!accessToken || !refreshToken) {
        console.log('You must provide values for accessToken, userId, and refreshToken. ' +
            'At least was was not provided. ' +
            'Values Provided were:' +
            `accessToken=${accessToken} | refreshToken=${refreshToken} | userId=${userId}`)
        return false
        // throw new Error(`You must provide values for accessToken, userId, and refreshToken. At least was was not provided. Values Provided were: accessToken=${accessToken} | refreshToken=${refreshToken} | userId=${userId}`)
    }
    try {
        let valuesToSet = [
            [ACCESS_TOKEN_FITBIT, accessToken],
            [USER_ID_FITBIT, userId],
            [REFRESH_TOKEN_FITBIT, refreshToken],
        ].filter(([, value]) => !!value)

        // console.log('attempting to persist these values:', JSON.stringify(valuesToSet))

        let response = await AsyncStorage.multiSet(valuesToSet)
        // console.log('response from setting tokens', response)
        LATEST_ACCESS_TOKEN = accessToken
        LAST_REFRESH_DATE = new Date().getTime()
        return true
    } catch (e) {
        console.warn('failed to persist fitbit credentials', e)
        return false
    }
}

async function removeFitbitKeysFromStorage() {
    try {
        await AsyncStorage.multiRemove([USER_ID_FITBIT, REFRESH_TOKEN_FITBIT, ACCESS_TOKEN_FITBIT])
        return true
    } catch (e) {
        console.error('something went wrong while removing fitbit keys form AsyncStorage', e)
        return false
    }
}

export async function getFitbitAccessToken() {
    try {
        if (LATEST_ACCESS_TOKEN) {
            return LATEST_ACCESS_TOKEN
        }

        let accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_FITBIT)
        // console.log('retrieved access token from AsyncStorage, checking if valid', accessToken)

        if (!accessToken) {
            console.warn('No access token found - you may need to log in')
            return null
        }

        let isActive = await isActiveAccessToken(accessToken)
        if (!isActive) {
            console.log('token was NOT valid, refreshing it')
            let refreshResult = await refreshAccessToken()
            // console.log('refresh token result', refreshResult)
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
        // console.log('retrieved refresh token from AsyncStorage', refreshToken)
        return refreshToken
    })
}

async function waitForRefreshToFinish() {
    return Timeout((resolve, reject) => {
        if (!IS_REFRESHING_TOKEN) {
            resolve({finished: true})
        }
        let check = setInterval(() => {
            if (!IS_REFRESHING_TOKEN) {
                clearInterval(check)
                resolve({finished: true})
            }
        }, 150)
    }, 2000)
}

/**
 * Default is expiry in 8 hours
 * @returns {Promise<any>}
 */
export async function refreshAccessToken() {
    if (IS_REFRESHING_TOKEN) {
        console.warn('The token is already being refreshed - waiting for it to finish')
        try {
            let {refreshed} = await waitForRefreshToFinish()
            return {
                refreshToken: LATEST_REFRESH_TOKEN,
                accessToken: LATEST_ACCESS_TOKEN,
            }
        } catch (e) {
            console.error('Failed to get refresh token after timeout interval', e)
            // throw new Error('Failed to get refresh token')
            return false
        }
    }

    console.log('refreshing current access token')
    let refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_FITBIT)
    // console.log(`retrieved refreshToken from AsyncStorage. refreshToken=${refreshToken}`)

    if (!refreshToken) {
        console.log('no refresh token present, can not refresh. Removing tokens from cache')
        await removeFitbitKeysFromStorage()
        return false
    }

    let url = 'https://api.fitbit.com/oauth2/token' +
        '?grant_type=refresh_token' +
        `&refresh_token=${refreshToken}`

    let authHeader = getBasicAuthHeader()

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        let {
            access_token,
            refresh_token,
            expires_in,
            user_id,
            token_type,
        } = await response.json()

        // console.log('refreshed token', access_token, refresh_token)
        let persistSuccess = await persistFitbitCredentials({
            accessToken: access_token,
            refreshToken: refresh_token,
            userId: user_id,
        })
        // console.log('persisted tokens successfully', persistSuccess)
        IS_REFRESHING_TOKEN = false
        ACCESS_TOKEN_EXPIRES_AT = addDuration({amount: expires_in, period: 'ms'})
        LATEST_ACCESS_TOKEN = access_token
        LATEST_REFRESH_TOKEN = refresh_token
        console.log('ACCESS_TOKEN_EXPIRES_AT ' + ACCESS_TOKEN_EXPIRES_AT)
        return {accessToken: access_token, refreshToken: refresh_token}
    } catch (e) {
        console.error('failed to refresh the token, clearing from local storage', e)
        await removeFitbitKeysFromStorage()
        IS_REFRESHING_TOKEN = false
        return {error: e}
    }

}

async function isActiveAccessToken(accessToken) {
    // console.log('introspecting access token', accessToken)
    console.log('introspecting access token')
    let url = 'https://api.fitbit.com/oauth2/introspect'
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `token=${accessToken}`,
        })
        let responseJson = await response.json()
        // console.log('got token info', responseJson)
        let {active} = responseJson
        if (active === 1) {
            console.log('token was found to be active')
            return true
        }
        console.log('token is not active')
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
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

        let responseJson = await response.json()
        console.log('got response from code auth token exchange', responseJson)
        let {access_token, refresh_token, expires_in, user_id, token_type} = responseJson
        try {
            await persistFitbitCredentials({accessToken: access_token, refreshToken: refresh_token, userId: user_id})
            let fetchedToken = await AsyncStorage.getItem(ACCESS_TOKEN_FITBIT)
            console.log(`Fetched token from storage. Are tokens equal? ${fetchedToken === access_token}. fetchedToken=${fetchedToken} | access_token=${access_token}`)
        } catch (e) {
            console.error('failed to persist fitbit credentials, continuing anyway', e)
        }

        return {
            accessToken: access_token,
            refreshToken: refresh_token,
            userId: user_id,
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

/** yyyy-MM-dd or today.
 *
 * @param startDate
 * @param endDate
 * @param period
 * @returns {Promise<void>}
 */
export async function fetchWeightForPeriod({startDate, endDate, period}) {
    try {
        let response = await authorizedRequest({
            url: `https://api.fitbit.com/1/user/-/body/weight/date/${startDate}/${endDate || period}.json`,
            method: 'GET',
        })
        console.log('fetched weight for time period ')
        if (response) {
            return response['body-weight'] || []
        }
        return []
    } catch (e) {
        console.log('failed to get weight for period', e)
    }
}

export async function fetchStepsForPeriod({startDate, endDate, period}) {
    try {
        let response = await authorizedRequest({
            url: `https://api.fitbit.com/1/user/-/activities/steps/date/${startDate}/${endDate || period}.json`,
            method: 'GET',
        })
        console.log('fetched steps for time period ', response)
        if (response) {
            return response['activities-steps'] || []
        }
        return []
    } catch (e) {
        console.log('failed to get steps for period', e)
    }
}

export async function fetchWeightForDay(dayKey) {
    // let accessToken = state.user.getIn(['fitbit', 'accessToken'])
    try {
        console.warn('method not supported right now, exiting')
        return null
        // if (!dayKey) {
        //     return null
        // }
        //
        // //response will always be present, or else an error would have been thrown
        // let response = await authorizedRequest({
        //     url: `https://api.fitbit.com/1/user/-/body/log/weight/date/${dayKey}.json`,
        //     method: 'GET',
        // })
        //
        // console.log('day weight response', response)
        // if (response.weight.length > 0) {
        //     return response.weight[0].weight
        // }

    } catch (e) {
        console.error('something went wrong while fetching the weight for day', dayKey, e)
        return null
    }
}

export async function fetchActivityForDay(dayKey) {

    try {
        console.warn('method not supported right now, exiting')
        return null
        // if (!dayKey) {
        //     return null
        // }
        //
        // let response = await authorizedRequest({
        //     url: `https://api.fitbit.com/1/user/-/activities/date/${dayKey}.json`,
        // })
        //
        // // console.log('retrieved the activity:', response)
        //
        // return response
        /*
        Sample response payload:
        {
            "activities":[
                {
                    "activityId":51007,
                    "activityParentId":90019,
                    "calories":230,
                    "description":"7mph",
                    "distance":2.04,
                    "duration":1097053,
                    "hasStartTime":true,
                    "isFavorite":true,
                    "logId":1154701,
                    "name":"Treadmill, 0% Incline",
                    "startTime":"00:25",
                    "steps":3783
                }
            ],
            "goals":{
                "caloriesOut":2826,
                "distance":8.05,
                "floors":150,
                "steps":10000
             },
            "summary":{
                "activityCalories":230,
                "caloriesBMR":1913,
                "caloriesOut":2143,
                "distances":[
                    {"activity":"tracker", "distance":1.32},
                    {"activity":"loggedActivities", "distance":0},
                    {"activity":"total","distance":1.32},
                    {"activity":"veryActive", "distance":0.51},
                    {"activity":"moderatelyActive", "distance":0.51},
                    {"activity":"lightlyActive", "distance":0.51},
                    {"activity":"sedentaryActive", "distance":0.51},
                    {"activity":"Treadmill, 0% Incline", "distance":3.28}
                ],
                "elevation":48.77,
                "fairlyActiveMinutes":0,
                "floors":16,
                "lightlyActiveMinutes":0,
                "marginalCalories":200,
                "sedentaryMinutes":1166,
                "steps":0,
                "veryActiveMinutes":0
            }
        }
         */

    } catch (e) {
        console.error('failed to get the activity for the day', e)
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

export async function authorizedRequest({url, method = 'GET', headers = {}, isRetry = false}) {
    if (!url) {
        throw new FetchError({message: 'No URL provided', status: 400})
    }
    if (isRetry) {
        console.log('retrying request...')
    }
    let accessToken
    try {
        accessToken = await getFitbitAccessToken()
    }
    catch (e) {
        console.error('error thrown when fetching the access token', e)
    }
    if (!accessToken) {
        console.log('no accessToken present')
        throw new FetchError({
            message: 'Unauthorized, no token present for the request',
            status: 401,
            loginRequired: true,
        })
    }


    let response = null
    try {
        console.log('fetching authenticated data from ' + url)
        response = await fetch(`${url}`, {
            method,
            headers: {
                ...headers,
                'Accept-Language': 'en_US',
                'Authorization': `Bearer ${accessToken}`,
            },
        })
    } catch (e) {
        console.error('Something unexpected went wrong with the fitbit authorized request', e)
        throw new FetchError({message: `failed to do authorized fitbit request: ${e.message}`, status: 500})
    }

    if (response && response.ok) {
        return await response.json()
    }
    else if (!isRetry && isTokenExpiredResponse(response)) {
        console.log('token was expired, refreshing tokens and trying the request again')
        let refreshSuccess = await refreshAccessToken()
        // console.log('refresh of tokens was: ', refreshSuccess)
        if (refreshSuccess) {
            try {
                return await authorizedRequest({url, method, headers, isRetry: true})
            } catch (e) {
                console.log('retry request failed', e)
            }
        }
        else {
            throw new FetchError({status: 403, message: 'Unable to refresh access tokens', loginRequired: true})
        }
    }
    else {
        console.error('The authorized fitbit request failed', response)
        throw new FetchError({status: response.status, message: response.statusText})
    }
}


// export function fetchWeightForDay()