import Immutable from 'immutable'

export const OPEN_CAMERA = 'camera/OPEN_CAMERA'
export const CLOSE_CAMERA = 'camera/CLOSE_CAMERA'

const initialState = Immutable.fromJS({
    isOpen: false,
})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case OPEN_CAMERA:
            state = state.set('isOpen', true)
            break
        case CLOSE_CAMERA:
            state = state.set('isOpen', false)
            break
        default:
            break
    }
    return state
}

export function openCamera() {
    return {
        type: OPEN_CAMERA
    }
}

export function closeCamera() {
    return {
        type: CLOSE_CAMERA
    }
}