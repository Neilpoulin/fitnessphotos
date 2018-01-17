import Immutable from 'immutable'
import dayReducer from 'ducks/day'
import {
    initialState as defaultDay,
    LOAD_DAY_REQUEST, LOAD_DAY_SUCCESS, LOAD_DAY_ERROR
} from './day'
import {fetchDayByKey, loadAllDays} from 'service/database';

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

export function loadAll() {
    return (dispatch, getState) => {
        loadAllDays().then(days => {
            days.map(day => {
                dispatch({
                    type: LOAD_DAY_SUCCESS,
                    dayKey: day.dayKey,
                    payload: day
                })
            })
        })
    }
}

export function loadDay(dayKey) {
    console.log('days.js - loadDay by dayKey = ' + dayKey)
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            let days = getState().days


            // if (!days.has(dayKey)) {
            dispatch({
                type: LOAD_DAY_REQUEST,
                dayKey,
            })
            return fetchDayByKey(dayKey).then((result) => {
                console.log('found days success from DB', result)
                dispatch({
                    type: LOAD_DAY_SUCCESS,
                    dayKey,
                    payload: result,
                })
            }).catch(error => {
                console.log('failed to load day', error)
                dispatch({
                    type: LOAD_DAY_ERROR,
                    dayKey,
                    payload: error
                })
                let dayState = days.get(dayKey)
                return resolve(dayState);
            })
            // }
            // //day is already in state, not loading
            // let dayState = days.get(dayKey)
            // return resolve(dayState);
        })

    }
}