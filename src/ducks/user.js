import Immutable from 'immutable'
import {SET_WEIGHT} from './day'
import {
    fetchWeightForDay,
    login as fitbitLogin
} from 'service/fitbitService'

export const LOGIN_FITBIT_REQUEST = 'user/LOGIN_FITBIT_REQUEST'
export const LOGIN_FITBIT_SUCCESS = 'user/LOGIN_FITBIT_SUCCESS'
export const LOGIN_FITBIT_ERROR = 'user/LOGIN_FITBIT_ERROR'

export const initialState = Immutable.fromJS({
    isLoading: false,
    userId: null,
    fitbit: {
        userId: null,
        accessToken: null,
        refreshToken: null,
    }

})

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_FITBIT_REQUEST:
            state = state.set('isLoading', true)
            break
        case LOGIN_FITBIT_SUCCESS:
            state = state.set('isLoading', false)
            state = state.setIn(['fitbit', 'userId'], action.payload.get('userId'))
            state = state.setIn(['fitbit', 'refreshToken'], action.payload.get('refreshToken'))
            state = state.setIn(['fitbit', 'accessToken'], action.payload.get('accessToken'))
            break
        case LOGIN_FITBIT_ERROR:
            state = state.set('isLoading', false)
            break
        default:
            break
    }

    return state
}

export function loginWithFitbit() {
    console.log('starting fitbit login flow')
    return dispatch => {
        dispatch({
            type: LOGIN_FITBIT_REQUEST
        })

        fitbitLogin().then(tokenInfo => {
            dispatch({
                type: LOGIN_FITBIT_SUCCESS,
                payload: tokenInfo
            })
        }).catch(error => {
            dispatch({
                type: LOGIN_FITBIT_ERROR,
                error,
                payload: error
            })
        })
    }
}


export function getWeightForDay(dayKey) {
    return async (dispatch, getState) => {
        console.log('FETCHING WEIGHT for ' + dayKey)
        try {
            let weightLbs = await fetchWeightForDay(dayKey)
            dispatch({
                type: SET_WEIGHT,
                dayKey,
                payload: weightLbs
            })
            return
        } catch (e) {
            console.error('unable to fetch weight for day')
            return
        }

        // const state = getState()
        // let accessToken = state.user.getIn(['fitbit', 'accessToken'])
        // if (!accessToken) {
        //     console.log('no accessToken present')
        //     return null
        // }
        // fetch(`https://api.fitbit.com/1/user/-/body/log/weight/date/${dayKey}.json`, {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${accessToken}`
        //     }
        // }).then(response => response.json()).then(response => {
        //     console.log('day weight response', response)
        //     if (response.weight.length > 0) {
        //         let weightLbs = kgToLbs(response.weight[0].weight)
        //
        //     }
        //
        // }).catch(error => {
        //     console.error('error getting weight', error)
        // })
    }
}
