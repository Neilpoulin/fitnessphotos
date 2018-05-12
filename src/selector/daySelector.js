import {getDayKey, getTimeStampFromDayKey} from 'util/TimeUtil'
import {initialState as dayDefault} from 'ducks/day'

export function getAllDaysList(state, toJs = true) {
    const days = state.days.get('daysByKey').toList()
        .filter(day => day.get('dayKey') != null)
        .sortBy(day => getTimeStampFromDayKey(day.get('dayKey')))
        .reverse()
    if (toJs) {
        return days.toJS()
    }
    return days

}

export function getDayState(state, {date, dayKey}) {
    dayKey = dayKey || getDayKey(date)
    return state.days.getIn(['daysByKey', dayKey], dayDefault)
}

export function getCurrentDayState(state) {
    let dateKey = getDayKey(state.dayInput.get('date'))
    return getDayState(state, {dateKey})
}

export function getScore(state, dayKey, scoreType) {
    return state.days.getIn(['daysByKey', dayKey, 'scores', scoreType])
}

export function getWeight(state, dayKey) {
    return state.days.getIn(['daysByKey', dayKey, 'weight'])
}

export function getSteps(state, dayKey) {
    return state.days.getIn(['daysBykey', dayKey, 'steps'])
}
