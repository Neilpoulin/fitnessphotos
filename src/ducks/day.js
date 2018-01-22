import Immutable from 'immutable'
import PropTypes from 'prop-types'
import {getDayState} from 'selector/daySelector'
import {upsertDay} from 'service/database'

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

export const propTypes = {
    dayKey: PropTypes.string,
    scores: PropTypes.shape({
        body: PropTypes.number,
        mind: PropTypes.number,
        food: PropTypes.number,
    }),
    imageUri: PropTypes.string,
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
    imageUri: null,
    weight: null,
    steps: null,
    isSaving: false,
    saveError: null,
    isLoading: false,
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_SCORE:
            state = state.setIn(['scores', action.payload.get('type')], action.payload.get('score', 0))
            break
        case SET_IMAGE:
            state = state.set('imageUri', action.payload ? action.payload.getIn(['uri']) : null)
            break
        case SAVE_SUCCESS:
            state = state.set('isSaving', false)
            state = state.set('dayId', action.payload.get('dayId'))
            break
        case SAVE_REQUEST:
            state = state.set('isLoading', true)
            break
        case SAVE_ERROR:
            state = state.set('isLoading', false)
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
    return state
}

export function saveDay(dayKey) {
    console.log('beginning saveDay function for dayKey', dayKey)
    return (dispatch, getState) => {
        const state = getState()
        let dayState = getDayState(state, {dayKey})
        upsertDay({
            dayKey,
            scores: dayState.get('scores').toJS(),
            weight: dayState.get('weight'),
            steps: dayState.get('steps'),
            imageUri: dayState.get('imageUri'),
        }).then(({dayId}) => {
            dispatch({
                type: SAVE_SUCCESS,
                payload: {
                    dayId,
                },
            })
        }).catch(error => {
            dispatch({
                type: SAVE_ERROR,
                payload: error,
            })
        })
    }
}