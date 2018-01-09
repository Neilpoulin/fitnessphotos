import Immutable from 'immutable'
import dayReducer from 'ducks/day'
import {initialState as defaultDay, LOADED_DAY} from './day'

const initialState = Immutable.fromJS({})

export default function (state = initialState, action) {
    let dayKey = action.dayKey
    if (dayKey) {
        let dayState = state.get(dayKey)
        dayState = dayReducer(dayState, action)
        state = state.set(dayKey, dayState)
    }
    return state
}

export function loadDay(dayKey) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            let days = getState().days
            let dayState = days.get(dayKey, defaultDay)
            dispatch({
                type: LOADED_DAY,
                dayKey,
                payload: dayState,
            })
            return resolve(dayState);
        })

    }
}