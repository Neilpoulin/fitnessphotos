import {getDateKey} from 'util/TimeUtil';
import {initialState as dayDefault} from 'ducks/day'

export function getDayState(state, {date, dayKey}) {
    dayKey = dayKey || getDateKey(date)
    return state.days.get(dayKey, dayDefault)
}

export function getCurrentDayState(state) {
    let dateKey = getDateKey(state.dayInput.get('date'))
    return getDayState(state, {dateKey})
}

export function getScore(state, dayKey, scoreType) {
    return state.days.getIn([dayKey, 'scores', scoreType])
}