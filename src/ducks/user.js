import Immutable from 'immutable'
import {
    login as fitbitLogin,
} from 'service/fitbitService'
import {
    signInWithGoogleAsync,
} from 'service/googleService'
import {fetchGoogleAuth, fetchUserId, clearKeys} from 'service/asyncStorageService'
import {saveGoogleAuth} from 'service/firebaseService'
import firebase from 'firebase'

export const LOGIN_FITBIT_REQUEST = 'user/LOGIN_FITBIT_REQUEST'
export const LOGIN_FITBIT_SUCCESS = 'user/LOGIN_FITBIT_SUCCESS'
export const LOGIN_FITBIT_ERROR = 'user/LOGIN_FITBIT_ERROR'

export const FITBIT_LOGIN_REQUIRED = 'user/FITBIT_LOGIN_REQUIRED'

export const SET_USER_ID = 'user/SET_USER_ID'

export const LOGIN_GOOGLE_REQUEST = 'user/LOGIN_GOOGLE_REQUEST'
export const LOGIN_GOOGLE_SUCCESS = 'user/LOGIN_GOOGLE_SUCCESS'
export const LOGIN_GOOGLE_ERROR = 'user/LOGIN_GOOGLE_ERROR'

export const LOGIN_FIREBASE_REQUEST = 'user/LOGIN_FIREBASE_REQUEST'
export const LOGIN_FIREBASE_SUCCESS = 'user/LOGIN_FIREBASE_SUCCESS'
export const LOGIN_FIREBASE_ERROR = 'user/LOGIN_FIREBASE_ERROR'

export const LOGOUT_SUCCESS = 'user/LOGOUT_SUCCESS'

export const initialState = Immutable.fromJS({
    isFitbitLoading: false,
    isLoadingFirebase: false,
    userId: null,
    firstName: null,
    lastName: null,
    displayName: null,
    email: null,
    photoURL: null,
    fitbit: {
        userId: null,
        accessToken: null,
        refreshToken: null,
        isLoggedIn: false,
    },
    isLoadingGoogle: false,
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER_ID:
            state = state.set('userId', action.payload.get('userId'))
            break
        case LOGIN_FITBIT_REQUEST:
            state = state.set('isFitbitLoading', true)
            break
        case LOGIN_FITBIT_SUCCESS:
            state = state.set('isFitbitLoading', false)
            state = state.setIn(['fitbit', 'userId'], action.payload.get('userId'))
            state = state.setIn(['fitbit', 'refreshToken'], action.payload.get('refreshToken'))
            state = state.setIn(['fitbit', 'accessToken'], action.payload.get('accessToken'))
            state = state.setIn(['fitbit', 'isLoggedIn'], true)
            break
        case LOGIN_FITBIT_ERROR:
            state = state.set('isFitbitLoading', false)
            break
        case FITBIT_LOGIN_REQUIRED:
            state = state.setIn(['fitbit', 'isLoggedIn'], false)
            break
        case LOGIN_GOOGLE_REQUEST:
            state = state.set('isLoadingGoogle', true)
            break
        case LOGIN_GOOGLE_SUCCESS:
            state = state.set('google', action.payload)
            state = state.set('isLoadingGoogle', false)
            state = state.set('firstName', action.payload.getIn(['user', 'givenName']))
            state = state.set('lastName', action.payload.getIn(['user', 'familyName']))
            break
        case LOGIN_GOOGLE_ERROR:
            state = state.setIn(['google', 'error'], action.error)
            state = state.set('isLoadingGoogle', false)
            break
        case LOGIN_FIREBASE_REQUEST:
            state = state.set('isLoadingFirebase', true)
            break
        case LOGIN_FIREBASE_SUCCESS:
            // state = state.set('google', action.payload)
            state = state.set('isLoadingFirebase', false)
            state = state.set('displayName', action.user.displayName)
            state = state.set('email', action.user.email)
            state = state.set('photoURL', action.user.photoURL)
            state = state.set('userId', action.user.uid)
            break
        case LOGIN_FIREBASE_ERROR:
            // state = state.setIn(['google', 'error'], action.error)
            state = state.set('isLoadingFirebase', false)
            break
        case LOGOUT_SUCCESS:
            state = initialState
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


export function loadUserFromCache() {
    return async dispatch => {
        const userId = await fetchUserId()
        dispatch({
            type: SET_USER_ID,
            payload: {userId},
        })
    }
}

export function loadUserIfExists() {
    return async dispatch => {

        // dispatch({type: LOGIN_FIREBASE_REQUEST})

        let user = firebase.auth().currentUser
        if (user) {
            console.log('auth().currentUser', user)
            dispatch({
                type: LOGIN_FIREBASE_SUCCESS,
                user,
            })
        } else {
            console.log('no auth().current user')
            // dispatch({type: LOGIN_FIREBASE_ERROR})
        }

        // return user
    }
}

export function loginWithGoogleFromCache() {
    return async dispatch => {
        const auth = await fetchGoogleAuth()
        if (auth) {
            dispatch({type: LOGIN_GOOGLE_SUCCESS, payload: auth})
            return true
        }
        return false
    }
}

export function logout() {
    console.log('logging out the user...')
    return async dispatch => {
        await clearKeys()
        dispatch({
            type: LOGOUT_SUCCESS,
        })
    }
}

export function loginWithGoogle() {
    console.log('starting google login flow')
    return async dispatch => {

        dispatch({
            type: LOGIN_GOOGLE_REQUEST,
        })
        try {
            const googleAuth = await signInWithGoogleAsync()
            if (googleAuth.error) {
                console.error('something went wrong logging in with google', googleAuth.error)
            }
            const {accessToken, idToken, user, refreshToken, serverAuthCode, uid} = googleAuth
            dispatch({
                type: LOGIN_GOOGLE_SUCCESS,
                payload: {accessToken, idToken, user, refreshToken, serverAuthCode, uid},
            })
            console.log('signed in with google successfully', googleAuth)
        } catch (e) {
            console.error('failed to login with google', e)
            dispatch({
                type: LOGIN_GOOGLE_ERROR,
                error: e,
            })
        }
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
