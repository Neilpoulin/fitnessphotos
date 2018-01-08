import Immutable from 'immutable'

export const initialState = Immutable.fromJS({
    dayId: null,
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        default:
            break
    }
    return state
}