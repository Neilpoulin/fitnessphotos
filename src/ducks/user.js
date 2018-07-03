import Immutable from 'immutable'
import {
    login as fitbitLogin,
} from 'service/fitbitService'
import {
    signInWithGoogleAsync,
    signInAsGuest as signInAsGuestFirebase,
} from 'service/googleService'
import {fetchGoogleAuth, fetchUserId, clearKeys} from 'service/asyncStorageService'
import {logoutFirebase, getCurrentUser, saveUserPreferences, fetchUserPreferences} from 'service/firebaseService'
import firebase from 'firebase'

export const LOGIN_FITBIT_REQUEST = 'user/LOGIN_FITBIT_REQUEST'
export const LOGIN_FITBIT_SUCCESS = 'user/LOGIN_FITBIT_SUCCESS'
export const LOGIN_FITBIT_ERROR = 'user/LOGIN_FITBIT_ERROR'

export const FITBIT_LOGIN_REQUIRED = 'user/FITBIT_LOGIN_REQUIRED'

export const SET_USER_ID = 'user/SET_USER_ID'

export const LOGIN_GOOGLE_REQUEST = 'user/LOGIN_GOOGLE_REQUEST'
export const LOGIN_GOOGLE_SUCCESS = 'user/LOGIN_GOOGLE_SUCCESS'
export const LOGIN_GOOGLE_ERROR = 'user/LOGIN_GOOGLE_ERROR'

export const LOGIN_GUEST_REQUEST = 'user/LOGIN_GUEST_REQUEST'
export const LOGIN_GUEST_SUCCESS = 'user/LOGIN_GUEST_SUCCESS'
export const LOGIN_GUEST_ERROR = 'user/LOGIN_GUEST_ERROR'

export const LOGIN_FIREBASE_REQUEST = 'user/LOGIN_FIREBASE_REQUEST'
export const LOGIN_FIREBASE_SUCCESS = 'user/LOGIN_FIREBASE_SUCCESS'
export const LOGIN_FIREBASE_ERROR = 'user/LOGIN_FIREBASE_ERROR'
export const LOGIN_FIREBASE_NO_USER = 'user/LOGIN_FIREBASE_NO_USER'

export const LOGOUT_SUCCESS = 'user/LOGOUT_SUCCESS'

export const SAVE_PREFERENCES_REQUEST = 'user/SAVE_PREFERENCES_REQUEST'
export const SAVE_PREFERENCES_SUCCESS = 'user/SAVE_PREFERENCES_SUCCESS'
export const SAVE_PREFERENCES_ERROR = 'user/SAVE_PREFERENCES_ERROR'
export const CLEAR_PREFERENCES_SUCCESS = 'user/CLEAR_PREFERENCES_SUCCESS'

export const initialState = Immutable.fromJS({
    isFitbitLoading: false,
    isLoadingFirebase: false,
    isLoadingGoogle: false,
    isLoadingGuest: false,
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
    google: {},
    guest: {},
    error: null,
    providerData: [],
    isAnonymous: false,
    imageUploadEnabled: false,
    isSavingPreferences: false,
    savePreferencesSuccess: false,
    savePreferencesError: null,
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
        case LOGIN_GUEST_REQUEST:
            state = state.set('isLoadingGuest', true)
            break
        case LOGIN_GUEST_SUCCESS:
            state = state.set('isLoadingGuest', false)
            state = state.set('guest', action.payload)
            break
        case LOGIN_GUEST_ERROR:
            state = state.set('isLoadingGuest', false)
            state = state.setIn(['guest', 'error'], Immutable.fromJS(action.error))
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
            state = state.setIn(['google', 'error'], Immutable.fromJS(action.error))
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
            state = state.set('providerData', action.user.providerData)
            state = state.set('isAnonymous', action.user.isAnonymous)
            state = state.set('imageUploadEnabled', action.user.imageUploadEnabled)
            //TODO: this needs to happen separately since fitbit login isn't on the user object
            // if (action.user.fitbitAuth) {
            //     state = state.set('fitbit', Immutable.fromJS(action.payload.user.fitbitAuth))
            //     state = state.setIn(['fitbit', 'isLoggedIn'], true)
            // }
            break
        case LOGIN_FIREBASE_NO_USER:
            state = state.set('isLoadingFirebase', false)
            break
        case LOGIN_FIREBASE_ERROR:
            // state = state.setIn(['google', 'error'], action.error)
            state = state.set('isLoadingFirebase', false)
            break
        case LOGOUT_SUCCESS:
            state = initialState
            break
        case SAVE_PREFERENCES_REQUEST:
            state = state.set('isSavingPreferences', true)
                .set('savePreferencesSuccess', false)
                .set('savePreferencesError', null)
                .merge(action.payload)
            break
        case SAVE_PREFERENCES_SUCCESS:
            state = state.set('isSavingPreferences', false)
                .set('savePreferencesSuccess', true)
                .set('savePreferencesError', null)
            break
        case SAVE_PREFERENCES_ERROR:
            state = state.set('isSavingPreferences', false)
                .set('savePreferencesSuccess', false)
                .set('savePreferencesError', Immutable.fromJS(action.error))
            break
        case CLEAR_PREFERENCES_SUCCESS:
            state = state.set('savePreferencesSuccess', false)
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

        dispatch({type: LOGIN_FIREBASE_REQUEST})

        let user = firebase.auth().currentUser
        if (user) {
            console.log('auth().currentUser', user)
            dispatch({
                type: LOGIN_FIREBASE_SUCCESS,
                user,
            })
        } else {
            console.log('no auth().current user')
            dispatch({type: LOGIN_FIREBASE_NO_USER})
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

export function handleAuthStateChange(user) {
    return dispatch => {
        if (user != null) {
            console.log('We are authenticated now!', user)
            fetchUserPreferences().then(prefs => {
                console.log('fetched preferences', prefs)
                dispatch({
                    type: LOGIN_FIREBASE_SUCCESS,
                    user: {
                        ...user,
                        ...prefs,
                    },
                })
            })

        }
        console.log('auth state changed. User = ', user)
    }
}

export function logout() {
    console.log('logging out the user...')
    return async dispatch => {
        await Promise.all([clearKeys(), logoutFirebase()])
        dispatch({
            type: LOGOUT_SUCCESS,
        })
    }
}

export function loginAsGuest() {
    return async dispatch => {
        dispatch({
            type: LOGIN_GUEST_REQUEST,
        })
        const guestAuth = await signInAsGuestFirebase()
        if (guestAuth.error) {
            console.error('something went wrong logging in as guest', guestAuth.error)
            dispatch({type: LOGIN_GUEST_ERROR, error: guestAuth.error})
        }
        else {
            dispatch({type: LOGIN_GUEST_SUCCESS, payload: guestAuth})
        }

    }
}

export function setUserPreferences(prefs) {
    console.log('saving user preferences setting', prefs)
    return async (dispatch) => {
        dispatch({type: SAVE_PREFERENCES_REQUEST, payload: prefs})
        const success = await saveUserPreferences(prefs)
        if (success) {
            dispatch({type: SAVE_PREFERENCES_SUCCESS, payload: prefs})
            window.setTimeout(() => dispatch({type: CLEAR_PREFERENCES_SUCCESS}), 2500)

        } else {
            dispatch({type: SAVE_PREFERENCES_ERROR, error: 'Failed to save preferences'})
        }
    }
}

function errorToJSON(error) {
    let json = error
    if (error.toJSON) {
        try {
            json = error.toJSON()
        }
        catch (jsonError) {
            console.log('can not call toJSON on this error', jsonError)
        }
    }
    return json
}

export function loginWithGoogle() {
    console.log('starting google login flow')
    return async dispatch => {

        dispatch({
            type: LOGIN_GOOGLE_REQUEST,
        })
        try {
            const googleAuth = await signInWithGoogleAsync()
            if (googleAuth && googleAuth.error) {
                switch (googleAuth.error.code) {
                    case 'auth/credential-already-in-use':
                        console.warn('auth credential in use already')
                        dispatch({
                            type: LOGIN_GOOGLE_ERROR,
                            error: errorToJSON(googleAuth.error.toJSON()),
                        })
                        break
                    default:
                        console.error('something went wrong logging in with google', googleAuth.error)
                        dispatch({
                            type: LOGIN_GOOGLE_ERROR,
                            error: errorToJSON(googleAuth.error.toJSON()),
                        })
                        break
                }
                return
            }
            const currentUser = getCurrentUser()
            const {accessToken, idToken, user, refreshToken, serverAuthCode, uid} = googleAuth
            dispatch({
                type: LOGIN_GOOGLE_SUCCESS,
                payload: {accessToken, idToken, user: user || currentUser, refreshToken, serverAuthCode, uid},
            })
            console.log('signed in with google successfully', googleAuth)
        } catch (e) {
            console.error('failed to login with google', e)
            dispatch({
                type: LOGIN_GOOGLE_ERROR,
                error: errorToJSON(e),
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
