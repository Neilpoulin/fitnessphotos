import Immutable from 'immutable'
import dayReducer from 'ducks/day'

const initialState = Immutable.fromJS({})

export default function (state = initialState, action) {
    let day = action.day
    if (day) {
        let dayState = state.get(day)
        dayState = dayReducer(dayState, action)
        state = state.set(day, dayState)
    }
    return state
}