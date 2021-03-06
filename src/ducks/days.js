import Immutable from 'immutable'
import dayReducer, {saveDay, SET_STEPS, SET_WEIGHT} from 'ducks/day'
import {
    initialState as defaultDay,
    LOAD_DAY_REQUEST, LOAD_DAY_SUCCESS, LOAD_DAY_ERROR,
} from './day'

export const LOAD_ALL_DAYS_REQUEST = 'days/LOAD_ALL_DAYS_REQUEST'
export const LOAD_ALL_DAYS_SUCCESS = 'days/LOAD_ALL_DAYS_SUCCESS'
export const LOAD_ALL_DAYS_ERROR = 'days/LOAD_ALL_DAYS_ERROR'

import {fetchDays, fetchDay} from 'service/firebaseService'
import {fetchStepsForPeriod, fetchWeightForPeriod} from 'service/fitbitService'
import {getUserId} from 'selector/userSelector'

const initialState = Immutable.fromJS({
    isLoading: false,
    daysByKey: {},
})

export default function (state = initialState, action) {
    let dayKey = action.dayKey

    switch (action.type) {
        case LOAD_ALL_DAYS_REQUEST:
            state = state.set('isLoading', true)
            break
        case LOAD_ALL_DAYS_SUCCESS:
            state = state.set('isLoading', false)
            state = state.set('daysByKey', action.payload.get('daysByKey', Immutable.Map({})))
            break
        case LOAD_ALL_DAYS_ERROR:
            state = state.set('isLoading', false)
            break
        default:
            if (dayKey) {
                let dayState = state.getIn(['daysByKey', dayKey])
                dayState = dayReducer(dayState, action)
                dayState = dayState.set('dayKey', dayKey)
                state = state.setIn(['daysByKey', dayKey], dayState)
            }
            break
    }

    return state
}

export function loadAll() {
    return async (dispatch, getState) => {
        console.log('LOAD ALL')
        dispatch({
            type: LOAD_ALL_DAYS_REQUEST,
        })
        const state = getState()
        const userId = await getUserId(state)
        fetchDays({userId}).then(days => {
            console.log('fetched days in the load all screen', days)

            const daysByKey = days.reduce((map, day) => {
                map[day.dayKey] = day
                return map
            }, {})

            dispatch({
                type: LOAD_ALL_DAYS_SUCCESS,
                payload: {
                    days,
                    daysByKey,
                },
            })
            console.log('all days', days)
            if (days && days.length > 0) {
                let noWeights = days.filter(day => !day.weight)
                let noStepDays = days.filter(day => !day.steps)
                //only days with no weight
                console.log('no weight days', noWeights)
                console.log('no step days', noStepDays)
                if (noWeights && noWeights.length > 0) {
                    // dispatch(loadAllWeightSince(noWeights[noWeights.length - 1].dayKey))
                }

                if (noStepDays && noStepDays.length > 0) {
                    // dispatch(loadAllStepsSince(noStepDays[noStepDays.length - 1].dayKey))
                }
            }

        })
    }
}

export function loadAllStepsSince(dayKey) {
    return async (dispatch, getState) => {
        try {
            let steps = await fetchStepsForPeriod({startDate: dayKey, endDate: 'today'})
            console.log('fetched steps', steps)
            if (steps) {
                steps.forEach(({dateTime, value}) => {
                    dispatch({
                        type: SET_STEPS,
                        dayKey: dateTime,
                        payload: value,
                    })
                    dispatch(saveDay(dateTime))
                })
            }

        } catch (e) {
            console.warn('something went wrong processing all weights since ' + dayKey)
        }
    }
}

export function loadAllWeightSince(dayKey) {
    return async (dispatch, getState) => {
        try {
            // let weights = await fetchWeightForPeriod({startDate: dayKey, endDate: 'today'})
            // console.log('fetched weights', weights)
            // if (weights) {
            //     weights.forEach(({dateTime, value}) => {
            //         dispatch({
            //             type: SET_WEIGHT,
            //             dayKey: dateTime,
            //             payload: value,
            //         })
            //         dispatch(saveDay(dateTime))
            //     })
            // }

        } catch (e) {
            console.warn('something went wrong processing all weights since ' + dayKey)
        }
    }
}

export function loadDay(dayKey) {
    console.log('days.js - loadDay by dayKey = ' + dayKey)
    return async (dispatch, getState) => {
        return new Promise(async (resolve, reject) => {
            const state = getState()
            let days = state.days
            const userId = await getUserId(state)

            // if (!days.has(dayKey)) {
            dispatch({
                type: LOAD_DAY_REQUEST,
                dayKey,
            })
            return fetchDay({dayKey, userId}).then((result) => {
                console.log('found day from DB', result)
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
                    payload: error,
                })
                let dayState = days.get(dayKey)
                return resolve(dayState)
            })
            // }
            // //day is already in state, not loading
            // let dayState = days.get(dayKey)
            // return resolve(dayState);
        })

    }
}