import {getDayKey} from 'util/TimeUtil'
import {initialState as dayDefault} from 'ducks/day'

export function getDayState(state, {date, dayKey}) {
    dayKey = dayKey || getDayKey(date)
    return state.days.get(dayKey, dayDefault)
}

export function getCurrentDayState(state) {
    let dateKey = getDayKey(state.dayInput.get('date'))
    return getDayState(state, {dateKey})
}

export function getScore(state, dayKey, scoreType) {
    return state.days.getIn([dayKey, 'scores', scoreType])
}

export function getWeight(state, dayKey) {
    return state.days.getIn([dayKey, 'weight'])
}

export function getSteps(state, dayKey) {
    return state.days.getIn([dayKey, 'steps'])
}
