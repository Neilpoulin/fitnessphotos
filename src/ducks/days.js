import Immutable from 'immutable'
import dayReducer from 'ducks/day'

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