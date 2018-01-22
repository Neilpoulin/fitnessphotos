import {getDayKey} from '../util/TimeUtil'

export function getCurrentDayKey(state) {
    let input = state.dayInput
    let dayKey = getDayKey(input.get('date'))
    return dayKey
}

export function getSteps(state) {

}