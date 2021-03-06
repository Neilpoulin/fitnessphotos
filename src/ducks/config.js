import Immutable from 'immutable'
import {initializeFirebase} from 'service/firebaseService'

export const INITIALIZE_REQUEST = 'config/INITIALIZE_REQUEST'
export const INITIALIZE_SUCCESS = 'config/INITIALIZE_SUCCESS'
export const INITIALIZE_ERROR = 'config/INITIALIZE_ERROR'

const initialState = Immutable.fromJS({
    isFitbitLoading: false,
    hasLoaded: false,
    isLoading: false,
    updatedAt: null,
    createdAt: null,
})


export default function reducer(state = initialState, action) {
    switch (action.type) {
        case INITIALIZE_REQUEST:
            state = state.set('isFitbitLoading', true)
            state = state.set('isLoading', true)
            break
        case INITIALIZE_SUCCESS:
            state = state.set('isFitbitLoading', false)
                .set('updatedAt', new Date())
                .set('createdAt', new Date())
                .set('isLoading', false)
                .set('hasLoaded', true)
            break
        default:
            break
    }
    return state
}

export function initializeApp() {
    console.log('initializing configs')
    return dispatch => {
        return new Promise(async (resolve, reject) => {

            dispatch({
                type: INITIALIZE_REQUEST,
            })

            await dispatch(await initializeFirebase())

            const config = {
                found: true,
            }

            dispatch({
                type: INITIALIZE_SUCCESS,
                payload: config,
            })
            resolve(config)
        })
    }
}