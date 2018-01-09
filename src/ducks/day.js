import Immutable from 'immutable'

export const SAVE_DAY = 'day/SAVE_DAY'
export const LOADED_DAY = 'day/LOADED_DAY'

export const initialState = Immutable.fromJS({
    dayId: null,
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SAVE_DAY:
            state = state.merge(action.payload)
            break
        default:
            break
    }
    return state
}