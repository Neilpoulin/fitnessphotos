import Immutable from 'immutable'
import moment from 'moment'
import {getDateKey, getTimeStampFromDayDay} from 'util/TimeUtil'
import {SET_SCORE, SET_IMAGE, saveDay} from './day'
import {loadDay} from './days';
import {getDayState, getScore} from 'selector/daySelector'
import {getWeightForDay} from './user'

export const SET_DATE = 'dayInput/SET_DATE'
export const SET_DAY_KEY = 'dayInput/SET_DAY_KEY'

export const SET_EDITING_IMAGE = 'dayInput/SET_EDITING_IMAGE'
export const SET_STATE = 'dayInput/SET_STATE'

const initialState = Immutable.fromJS({
    date: (new Date()).getTime(),
    scores: {
        mind: null,
        body: null,
        food: null,
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
            state = state.set('date', getTimeStampFromDayDay(action.payload))
            break
        default:
            break
    }
    return state
}

export function setDate(date) {
    return (dispatch) => {
        const dayKey = getDateKey(date)
        dispatch({
            type: SET_DATE,
            dayKey,
            payload: moment(date).toDate().getTime()
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
        let state = getState().dayInput;
        let nextDate = moment(state.get('date')).add(1, 'd').toDate().getTime()
        return dispatch(setDate(nextDate))
    }
}

function setScore({type, score}) {
    return (dispatch, getState) => {
        const state = getState()
        let dayKey = getDateKey(state.dayInput.get('date'))
        let currentScore = getScore(state, dayKey, type);
        console.log('score type to save: ', type, 'current score: ', currentScore, 'updated score', score)
        if (currentScore !== score) {
            dispatch({
                type: SET_SCORE,
                dayKey,
                payload: {
                    type,
                    score,
                }
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

export function setImage({uri}) {
    return (dispatch, getState) => {
        let dayKey = getDateKey(getState().dayInput.get('date'))
        dispatch({
            type: SET_IMAGE,
            dayKey,
            payload: {uri},
        })
        dispatch(save())
    }
}

export function setEditingImage(isEditing) {
    return dispatch => {
        dispatch({
            type: SET_EDITING_IMAGE,
            payload: isEditing
        })
    }
}

export function loadCurrentDay() {
    return (dispatch, getState) => {
        let input = getState().dayInput
        let dayKey = getDateKey(input.get('date'))
        if (dayKey) {
            dispatch(loadDay(dayKey))
            dispatch(getWeightForDay(dayKey))
        }
    }
}

function save() {
    return (dispatch, getState) => {
        let input = getState().dayInput
        let dayKey = getDateKey(input.get('date'))
        console.log('calling say day with dayKey', dayKey)
        dispatch(saveDay(dayKey))

        // dispatch({
        //     type: SAVE_DAY,
        //     dayKey: getDateKey(input.get('date')),
        //     payload: input,
        // })
    }
}