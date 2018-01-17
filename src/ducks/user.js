import Immutable from 'immutable'
import {AuthSession} from 'expo'
import {btoa} from 'util/Base64'
import {SET_WEIGHT} from './day'

const KG_TO_LB = 2.20462
const FITBIT_CLIENT_ID = '22CQ77'
const FITBIT_CLIENT_SECRET = 'd006ce8c5ca56a1da89440bab320766c'

export const LOGIN_FITBIT_REQUEST = 'user/LOGIN_FITBIT_REQUEST'
export const LOGIN_FITBIT_SUCCESS = 'user/LOGIN_FITBIT_SUCCESS'
export const LOGIN_FITBIT_ERROR = 'user/LOGIN_FITBIT_ERROR'

export const initialState = Immutable.fromJS({
    isLoading: false,
    userId: null,
    fitbit: {
        userId: null,
        accessToken: null,
        refreshToken: null,
    }

})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_FITBIT_REQUEST:
            state = state.set('isLoading', true)
            break
        case LOGIN_FITBIT_SUCCESS:
            state = state.set('isLoading', false)
            state = state.setIn(['fitbit', 'userId'], action.payload.get('user_id'))
            state = state.setIn(['fitbit', 'refreshToken'], action.payload.get('refresh_token'))
            state = state.setIn(['fitbit', 'accessToken'], action.payload.get('access_token'))
            break
        case LOGIN_FITBIT_ERROR:
            state = state.set('isLoading', false)
            break
        default:
            break
    }

    return state
}

export function loginWithFitbit() {
    console.log('starting fitbit login flow')
    return dispatch => {
        dispatch({
            type: LOGIN_FITBIT_REQUEST
        })
        let redirectUrl = AuthSession.getRedirectUrl()
        console.log('redirect uri', redirectUrl)
        let authUrl = 'https://www.fitbit.com/oauth2/authorize' +
            `?client_id=${FITBIT_CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
            '&response_type=code' +
            `&scope=${encodeURIComponent('weight heartrate sleep profile activity nutrition')}`
        console.log('authUrl', authUrl)
        AuthSession.startAsync({
            authUrl,

        }).then(result => {
            console.log('got auth result', result)

            if (result.errorCode) {
                dispatch({
                    type: LOGIN_FITBIT_ERROR,
                    error: result.errorCode,
                    payload: result,
                })
                return
            }
            let {code} = result.params
            exchangeFitbitCodeForAuthToken(code, redirectUrl).then(tokenInfo => {
                console.log('got token info', tokenInfo)
                let {access_token, refresh_token, expires_in, user_id, token_type} = tokenInfo
                dispatch({
                    type: LOGIN_FITBIT_SUCCESS,
                    payload: {
                        access_token,
                        refresh_token,
                        expires_in,
                        user_id,
                        token_type
                    }
                })
            }).catch(error => {
                dispatch({
                    type: LOGIN_FITBIT_ERROR,
                    error,
                })
            })


        }).catch(error => {
            console.error('failed to get auth info ', error)
        })
    }
}

export function exchangeFitbitCodeForAuthToken(code, redirectUri) {
    console.log('getting fitbit data for code', code)
    let authHeader = `Basic ${btoa(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`)}`

    let url = 'https://api.fitbit.com/oauth2/token' +
        '?grant_type=authorization_code' +
        `&client_id=${FITBIT_CLIENT_ID}` +
        `&redirect_uri=${redirectUri}` +
        `&code=${code}`

    return fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    }).then(response => response.json())

}

export function getWeightForDay(dayKey) {
    return (dispatch, getState) => {
        console.log('FETCHING WEIGHT for ' + dayKey)
        const state = getState()
        let accessToken = state.user.getIn(['fitbit', 'accessToken'])
        if (!accessToken) {
            console.log('no accessToken present')
            return null
        }
        fetch(`https://api.fitbit.com/1/user/-/body/log/weight/date/${dayKey}.json`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(response => response.json()).then(response => {
            console.log('day weight response', response)
            if (response.weight.length > 0) {
                let weightLbs = response.weight[0].weight * KG_TO_LB
                dispatch({
                    type: SET_WEIGHT,
                    dayKey,
                    payload: weightLbs
                })
            }

        }).catch(error => {
            console.error('error getting weight', error)
        })
    }
}