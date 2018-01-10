import Immutable from 'immutable'

export const SAVE_DAY = 'day/SAVE_DAY'
export const LOADED_DAY = 'day/LOADED_DAY'
export const SET_SCORE = 'day/SET_SCORE'
export const SET_IMAGE = 'day/SET_IMAGE'


export const initialState = Immutable.fromJS({
    dayId: null,
    date: (new Date()).getTime(),
    scores: {
        mind: null,
        body: null,
        food: null,
    },
    image: null,
    isEditingImage: false,
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SAVE_DAY:
            state = state.merge(action.payload)
            break
        case SET_SCORE:
            state = state.setIn(['scores', action.payload.get('type')], action.payload.get('score'))
            break
        case SET_IMAGE:
            state = state.set('image', action.payload)
            break
        default:
            break
    }
    return state
}