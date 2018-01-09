import Immutable from 'immutable'
import moment from 'moment'
import {getDateKey} from 'util/TimeUtil'

export const SET_DATE = 'dayInput/SET_DATE'
export const SET_SCORE = 'dayInput/SET_SCORE'
export const SET_IMAGE = 'dayInput/SET_IMAGE'
export const SET_EDITING_IMAGE = 'dayInput/SET_EDITING_IMAGE'
const initialState = Immutable.fromJS({
    date: (new Date()).getTime(),
    scores: {
        mind: null,
        body: null,
        food: null,
    },
    image: null,
    isEditingImage: false,
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_DATE:
            state = state.set('date', action.payload)
            break
        case SET_SCORE:
            state = state.setIn(['scores', action.payload.get('type')], action.payload.get('score'))
            break
        case SET_IMAGE:
            state = state.set('image', action.payload)
            break
        case SET_EDITING_IMAGE:
            state = state.set('isEditingImage', action.payload)
            break
        default:
            break
    }
    return state
}

export function setDate(date) {
    return (dispatch) => {
        dispatch({
            type: SET_DATE,
            dayKey: getDateKey(date),
            payload: moment(date).toDate().getTime()
        })
    }
}

export function goToPreviousDate() {
    return (dispatch, getState) => {
        let state = getState().dayInput;
        let nextDate = moment(state.get('date')).subtract(1, 'd').toDate().getTime()
        return dispatch(setDate(nextDate))
    }
}

export function goToNextDate() {
    return (dispatch, getState) => {
        let state = getState().dayInput;
        let nextDate = moment(state.get('date')).add(1, 'd').toDate().getTime()
        return dispatch(setDate(nextDate))
    }
}

function setScore(type, score) {
    return {
        type: SET_SCORE,
        payload: {
            type,
            score,
        }
    }
}

export function setMindScore(score) {
    return setScore('mind', score)
}

export function setBodyScore(score) {
    return setScore('body', score)
}

export function setFoodScore(score) {
    return setScore('food', score)
}

export function setImage({uri}) {
    return {
        type: SET_IMAGE,
        payload: {uri},
    }
}

export function setEditingImage(isEditing) {
    return {
        type: SET_EDITING_IMAGE,
        payload: isEditing
    }
}