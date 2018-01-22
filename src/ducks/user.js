import Immutable from 'immutable'
import {
    login as fitbitLogin,
} from 'service/fitbitService'

export const LOGIN_FITBIT_REQUEST = 'user/LOGIN_FITBIT_REQUEST'
export const LOGIN_FITBIT_SUCCESS = 'user/LOGIN_FITBIT_SUCCESS'
export const LOGIN_FITBIT_ERROR = 'user/LOGIN_FITBIT_ERROR'

export const FITBIT_LOGIN_REQUIRED = 'user/FITBIT_LOGIN_REQUIRED'

export const initialState = Immutable.fromJS({
    isLoading: false,
    userId: null,
    fitbit: {
        userId: null,
        accessToken: null,
        refreshToken: null,
        isLoggedIn: false,
    },

})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_FITBIT_REQUEST:
            state = state.set('isLoading', true)
            break
        case LOGIN_FITBIT_SUCCESS:
            state = state.set('isLoading', false)
            state = state.setIn(['fitbit', 'userId'], action.payload.get('userId'))
            state = state.setIn(['fitbit', 'refreshToken'], action.payload.get('refreshToken'))
            state = state.setIn(['fitbit', 'accessToken'], action.payload.get('accessToken'))
            state = state.setIn(['fitbit', 'isLoggedIn'], true)
            break
        case LOGIN_FITBIT_ERROR:
            state = state.set('isLoading', false)
            break
        case FITBIT_LOGIN_REQUIRED:
            state = state.setIn(['fitbit', 'isLoggedIn'], false)
            break
        default:
            break
    }

    return state
}

export function initialize() {
    return (dispatch, getState) => {

    }
}

export function loginWithFitbit() {
    console.log('starting fitbit login flow')
    return dispatch => {
        dispatch({
            type: LOGIN_FITBIT_REQUEST,
        })

        fitbitLogin().then(tokenInfo => {
            dispatch({
                type: LOGIN_FITBIT_SUCCESS,
                payload: tokenInfo,
            })
        }).catch(error => {
            dispatch({
                type: LOGIN_FITBIT_ERROR,
                error,
                payload: error,
            })
        })
    }
}
