import Immutable from 'immutable'
import moment from 'moment'
import {getDateKey} from 'util/TimeUtil'

export const SET_DATE = 'dayInput/SET_DATE'

const initialState = Immutable.fromJS({
    date: (new Date()).getTime(),
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_DATE:
            state = state.set('date', action.payload)
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