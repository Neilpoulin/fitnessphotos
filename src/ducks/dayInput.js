import Immutable from 'immutable'
import moment from 'moment'
import {getDayKey, getTimeStampFromDayKey} from 'util/TimeUtil'
import {saveDay, SET_IMAGE, SET_SCORE} from './day'
import {loadDay} from './days'
// import {fetchWeightForDay} from 'service/fitbitService'
// import {FITBIT_LOGIN_REQUIRED} from './user'
import {getScore, getSteps} from 'selector/daySelector'
import {getCurrentDayKey} from 'selector/dayInputSelector'
import {uploadImage as uploadToFirebase} from 'service/firebaseService'
import {SET_IMAGE_LOAD_ERROR} from 'ducks/day'

export const SET_DATE = 'dayInput/SET_DATE'
export const SET_DAY_KEY = 'dayInput/SET_DAY_KEY'

export const SET_EDITING_IMAGE = 'dayInput/SET_EDITING_IMAGE'
export const SET_STATE = 'dayInput/SET_STATE'
export const FETCH_FITBIT_ACTIVITY_REQUEST = 'dayInput/FETCH_FITBIT_ACTIVITY_REQUEST'
export const FETCH_FITBIT_ACTIVITY_SUCCESS = 'dayInput/FETCH_FITBIT_ACTIVITY_SUCCESS'
export const FETCH_FITBIT_ACTIVITY_ERROR = 'dayInput/FETCH_FITBIT_ACTIVITY_ERROR'

export const UPLOAD_IMAGE_REQUEST = 'dayInput/UPLOAD_IMAGE_REQUEST'
export const UPLOAD_IMAGE_SUCCESS = 'dayInput/UPLOAD_IMAGE_SUCCESS'
export const UPLOAD_IMAGE_ERROR = 'dayInput/UPLOAD_IMAGE_ERROR'

const initialState = Immutable.fromJS({
    date: (new Date()).getTime(),
    scores: {
        mind: null,
        body: null,
        food: null,
    },
    imageIsUploading: false,
    imageUploadSuccess: false,
    imageUploadError: null,
    imageDownloadURL: null,
    activity: {
        fitbit: {
            loading: false,
            error: null,
        },
    },
    isEditingImage: false,
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_DATE:
            state = state.set('date', action.payload)
            break
        case SET_EDITING_IMAGE:
            state = state.set('isEditingImage', action.payload)
            break
        case SET_DAY_KEY:
            state = state.set('date', getTimeStampFromDayKey(action.payload))
            break
        case FETCH_FITBIT_ACTIVITY_REQUEST:
            state = state.setIn(['activity', 'fitbit', 'loading'], true)
            break
        case FETCH_FITBIT_ACTIVITY_ERROR:
            state = state.setIn(['activity', 'fitbit', 'error'], action.payload)
            state = state.setIn(['activity', 'fitbit', 'loading'], false)
            break
        case FETCH_FITBIT_ACTIVITY_SUCCESS:
            state = state.setIn(['activity', 'fitbit'], action.payload)
            state = state.setIn(['activity', 'fitbit', 'loading'], false)
            break
        case UPLOAD_IMAGE_REQUEST:
            state = state.set('imageIsUploading', true)
            state = state.set('imageUploadSuccess', false)
            break
        case UPLOAD_IMAGE_SUCCESS:
            state = state.set('imageIsUploading', false)
            state = state.set('imageDownloadURL', action.payload.get('downloadURL'))
            break
        case UPLOAD_IMAGE_ERROR:
            state = state.set('imageIsUploading', false)
            state = state.set('imageUploadSuccess', false)
            state = state.set('imageUploadError', action.payload.get('error'))
            break
        default:
            break
    }
    return state
}

export function setDayKey(dayKey) {
    return (dispatch) => {
        dispatch({
            type: SET_DATE,
            dayKey,
            payload: getTimeStampFromDayKey(dayKey),
        })
        dispatch(loadCurrentDay())
    }
}

export function setDate(date) {
    return (dispatch) => {
        const dayKey = getDayKey(date)
        dispatch({
            type: SET_DATE,
            dayKey,
            payload: moment(date).toDate().getTime(),
        })
        dispatch(loadCurrentDay())
    }
}

export function goToPreviousDate() {
    return (dispatch, getState) => {
        let state = getState().dayInput
        let nextDate = moment(state.get('date')).subtract(1, 'd').toDate().getTime()
        return dispatch(setDate(nextDate))
    }
}

export function goToNextDate() {
    return (dispatch, getState) => {
        let state = getState().dayInput
        let nextDate = moment(state.get('date')).add(1, 'd').toDate().getTime()
        return dispatch(setDate(nextDate))
    }
}

export function goToToday() {
    return (dispatch) => {
        dispatch(setDate((new Date()).getTime()))

    }
}

export function setImageLoadError(error) {
    return (dispatch, getState) => {
        const state = getState()
        let dayKey = getCurrentDayKey(state)
        dispatch({type: SET_IMAGE_LOAD_ERROR, dayKey, payload: {error: error}})
    }
}

function setScore({type, score}) {
    return (dispatch, getState) => {
        const state = getState()
        let dayKey = getCurrentDayKey(state)
        let currentScore = getScore(state, dayKey, type)
        console.log('score type to save: ', type, 'current score: ', currentScore, 'updated score', score)
        if (currentScore !== score) {
            dispatch({
                type: SET_SCORE,
                dayKey,
                payload: {
                    type,
                    score,
                },
            })
            dispatch(save())
        }

    }
}

export function setMindScore(score) {
    return setScore({type: 'mind', score})
}

export function setBodyScore(score) {
    return setScore({
        type: 'body',
        score,
    })
}

export function setFoodScore(score) {
    return setScore({type: 'food', score})
}

export function uploadImage({uri, height, width}) {
    return async (dispatch) => {
        dispatch({
            type: UPLOAD_IMAGE_REQUEST, payload: {uri},
        })
        try {
            const response = await uploadToFirebase({uri})
            if (response.success) {
                dispatch({
                    type: UPLOAD_IMAGE_SUCCESS, payload: {uri, ...response},
                })
                dispatch(setImage({uri: response.downloadURL, height, width}))
                // dispatch(save())
            } else {
                dispatch({
                    type: UPLOAD_IMAGE_ERROR,
                    payload: {
                        uri, ...response,
                    },
                })
            }
        } catch (e) {
            dispatch({
                type: UPLOAD_IMAGE_ERROR, payload: {uri, error: e},
            })
        }
    }
}

export function setImage({uri, height, width}) {
    return (dispatch, getState) => {
        let dayKey = getDayKey(getState().dayInput.get('date'))
        dispatch({
            type: SET_IMAGE,
            dayKey,
            payload: {uri, height, width},
        })
        dispatch(save())
    }
}

export function setEditingImage(isEditing) {
    return dispatch => {
        dispatch({
            type: SET_EDITING_IMAGE,
            payload: isEditing,
        })
    }
}

export function getActivityForDay() {
    return async (dispatch, getState) => {
        dispatch({
            type: FETCH_FITBIT_ACTIVITY_REQUEST,
        })
        const state = getState()
        let dayKey = getCurrentDayKey(state)
        let daySteps = getSteps(state, dayKey)
        if (daySteps) {
            console.log('already fetched steps for day, not loading again')
            return null
        }
        try {
            // let activity = await fetchActivityForDay(dayKey)
            // dispatch({
            //     type: FETCH_FITBIT_ACTIVITY_SUCCESS,
            //     payload: activity,
            // })
            // dispatch({
            //     type: SET_STEPS,
            //     dayKey,
            //     payload: Immutable.fromJS(activity).getIn(['summary', 'steps']),
            // })
            dispatch(save())
        } catch (e) {
            dispatch({
                type: FETCH_FITBIT_ACTIVITY_ERROR,
                error: e,
            })
        }


    }

}

//
// export function getWeightForDay() {
//     return async (dispatch, getState) => {
//         try {
//
//             const state = getState()
//             let dayKey = getCurrentDayKey(state)
//             let dayWeight = getWeight(state, dayKey)
//             if (dayWeight) {
//                 console.log('already has date, not loading')
//                 return null
//             }
//             console.log(`fetching weight for day: ${dayKey}`)
//             let weightLbs = await fetchWeightForDay(dayKey)
//             if (weightLbs) {
//                 dispatch({
//                     type: SET_WEIGHT,
//                     dayKey,
//                     payload: weightLbs,
//                 })
//             } else {
//                 console.log('no weight was returned, not setting it')
//             }
//
//         } catch (e) {
//             console.log('unable to fetch weight for day', e)
//             if (e.loginRequired) {
//                 dispatch({
//                     type: FITBIT_LOGIN_REQUIRED,
//                     payload: {
//                         loginRequired: e.loginRequired,
//                     },
//                 })
//             }
//         }
//     }
// }

export function loadCurrentDay() {
    return (dispatch, getState) => {
        const state = getState()
        let dayKey = getCurrentDayKey(state)
        if (dayKey) {
            dispatch(loadDay(dayKey))
            // dispatch(getWeightForDay())
            // dispatch(getActivityForDay())
        }
    }
}

function save() {
    return (dispatch, getState) => {
        let input = getState().dayInput
        let dayKey = getDayKey(input.get('date'))
        console.log('calling save day with dayKey', dayKey)
        dispatch(saveDay(dayKey))
    }
}