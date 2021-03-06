import Immutable from 'immutable'
import PropTypes from 'prop-types'
import {getDayState} from 'selector/daySelector'
import {getUserId} from 'selector/userSelector'
import {saveDay as saveDayFirebase} from 'service/firebaseService'

export const SAVE_REQUEST = 'day/SAVE_REQUEST'
export const SAVE_SUCCESS = 'day/SAVE_SUCCESS'
export const SAVE_ERROR = 'day/SAVE_ERROR'

export const LOAD_DAY_REQUEST = 'day/LOAD_DAY_REQUEST'
export const LOAD_DAY_SUCCESS = 'day/LOAD_DAY_SUCCESS'
export const LOAD_DAY_ERROR = 'day/LOAD_DAY_ERROR'

export const SET_SCORE = 'day/SET_SCORE'
export const SET_IMAGE = 'day/SET_IMAGE'

export const SET_WEIGHT = 'day/SET_WEIGHT'
export const SET_STEPS = 'day/SET_STEPS'

export const SET_IMAGE_LOAD_ERROR = 'day/SET_IMAGE_LOAD_ERROR'

export const propTypes = {
    dayKey: PropTypes.string,
    scores: PropTypes.shape({
        body: PropTypes.number,
        mind: PropTypes.number,
        food: PropTypes.number,
    }),
    localImageUri: PropTypes.string,
    cloudImageUri: PropTypes.string,
    weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export const initialState = Immutable.fromJS({
    dayId: null,
    dayKey: null,
    scores: {
        mind: 0,
        body: 0,
        food: 0,
    },
    localImageUri: null,
    cloudImageUri: null,
    imageSize: {},
    weight: null,
    steps: null,
    isSaving: false,
    isLoading: false,
    saveError: null,
    isFitbitLoading: false,
    imageLoadError: null,
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_SCORE:
            state = state.setIn(['scores', action.payload.get('type')], action.payload.get('score', 0))
            break
        case SET_IMAGE:
            state = state.set('localImageUri', action.payload ? action.payload.get('localUri') : null)
            state = state.set('cloudImageUri', action.payload ? action.payload.get('cloudUri') : null)

            state = state.set('imageLoadError', null)
            if (action.payload) {
                state = state.setIn(['imageSize', 'height'], action.payload.get('height', 0))
                state = state.setIn(['imageSize', 'width'], action.payload.get('width', 0))
            }
            break
        case SET_IMAGE_LOAD_ERROR:
            state = state.set('imageLoadError', action.payload ? action.payload.get('error') : null)
            break
        case SAVE_SUCCESS:
            state = state.set('isSaving', false)
            state = state.set('dayId', action.payload.get('dayId'))
            // state = state.set('dayKey', action.payload.get('dayId'))
            break
        case SAVE_REQUEST:
            state = state.set('isSaving', true)
            break
        case SAVE_ERROR:
            state = state.set('saveError', action.payload)
            break
        case LOAD_DAY_REQUEST:
            state = state.set('isLoading', true)
            break
        case LOAD_DAY_ERROR:
            state = state.set('isLoading', false)
            state = state.set('error', action.payload)
            break
        case LOAD_DAY_SUCCESS:
            state = state.set('isLoading', false)
            state = state.merge(action.payload)
            state = state.set('error', null)
            break
        case SET_WEIGHT:
            state = state.set('weight', action.payload)
            break
        case SET_STEPS:
            state = state.set('steps', action.payload)
            break
        default:
            break
    }
    state = state.set('dayKey', action.dayKey)
    return state
}


export function saveDay(dayKey) {
    console.log('beginning saveDay function for dayKey', dayKey)
    return async (dispatch, getState) => {
        const state = getState()
        let userId = await getUserId(state)
        console.log('found user id', userId)
        let dayState = getDayState(state, {dayKey})
        let imageSize = dayState.get('imageSize', Immutable.Map({})).toJS()
        if (!imageSize || !imageSize.width || !imageSize.height) {
            imageSize = {}
        }
        const dayData = {
            dayKey,
            scores: dayState.get('scores').toJS(),
            weight: dayState.get('weight'),
            steps: dayState.get('steps'),
            localImageUri: dayState.get('localImageUri', null) || null,
            cloudImageUri: dayState.get('cloudImageUri', null) || null,
            imageSize,
        }


        console.log('saving day', dayData)
        dispatch({type: SAVE_REQUEST, dayKey})
        saveDayFirebase(dayData, userId).then(response => {
            console.log('firebase response', response)
            dispatch({
                type: SAVE_SUCCESS,
                payload: {
                    dayId: dayKey,
                },
            })
        }).catch(error => {
            console.error('firebase error', error)
            dispatch({
                type: SAVE_ERROR,
                payload: error,
            })
        })
        // upsertDay(dayData).then(({dayId}) => {
        //     dispatch({
        //         type: SAVE_SUCCESS,
        //         payload: {
        //             dayId,
        //         },
        //     })
        // }).catch(error => {
        //     dispatch({
        //         type: SAVE_ERROR,
        //         payload: error,
        //     })
        // })
    }
}