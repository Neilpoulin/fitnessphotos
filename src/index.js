import React from 'react'
import {Provider} from 'react-redux'
import reducers from './ducks'
import thunkMiddleware from 'redux-thunk'
import immutableAction from './middleware/immutable-action'
import {createStore, applyMiddleware} from 'redux'
import {initialize as initializeConfig} from 'ducks/config'
import {composeWithDevTools} from 'remote-redux-devtools'
import ModalStackNavigator from 'view/nav/ModalStackNavigator'
import {startDb} from 'service/database'
import {initialize as initializeFitbit} from 'service/fitbitService'
import {initialize as initializeUser} from 'ducks/user'

console.log('attempting to set up store')
let middlewares = [thunkMiddleware, immutableAction]
let devToolsEnhancer = composeWithDevTools({realtime: true})
const store = createStore(reducers, devToolsEnhancer(applyMiddleware(...middlewares)))
const dispatch = store.dispatch
startDb(store.dispatch)

dispatch(initializeConfig()).then(config => {
    console.log('loaded config', config)
    //initialize the fitbit tokens
    initializeFitbit().then(tokens => {
        console.log('successfully initialized the fitbit service', tokens)
    })
    dispatch(initializeUser())

})


const Main = () => {
    return <Provider store={store}>
        <ModalStackNavigator/>
    </Provider>
}

export default Main