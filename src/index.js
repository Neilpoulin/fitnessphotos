import React from 'react'
import {Provider} from 'react-redux'
import AppTabNavigation from 'view/nav/AppTabNavigations'
import {View} from 'react-native'
import reducers from './ducks'
import thunkMiddleware from 'redux-thunk'
import immutableAction from './middleware/immutable-action'
import {createStore, applyMiddleware, compose} from 'redux'
import {initialize} from 'ducks/config'
import {composeWithDevTools} from 'remote-redux-devtools'

console.log('attempting to set up store')
let middlewares = [thunkMiddleware, immutableAction]
//
const store = createStore(reducers, composeWithDevTools(applyMiddleware(...middlewares)))
// store.subscribe()
store.dispatch(initialize()).then(config => {
    console.log('loaded config', config)
})


const Main = () => {
    return <Provider store={store}><AppTabNavigation/></Provider>
}

export default Main