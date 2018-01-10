import {getDateKey} from 'util/TimeUtil';
import {initialState as dayDefault} from 'ducks/day'

export function getDayState(state, date) {
    let dayKey = getDateKey(date)
    return state.days.get(dayKey, dayDefault)
}