import React from 'react'
import {Provider} from 'react-redux'
import ModalStackNavigator from 'view/nav/ModalStackNavigator'
import reducers from './ducks/reducers'
import thunkMiddleware from 'redux-thunk'
import immutableAction from './middleware/immutable-action'
import {applyMiddleware, createStore} from 'redux'
import {initializeApp} from 'ducks/config'
import {composeWithDevTools} from 'redux-devtools-extension'
import {loadUserIfExists} from 'ducks/user'

console.disableYellowBox = true

console.log('index.js starting')

console.log('attempting to set up store')
let middlewares = [thunkMiddleware, immutableAction]
let devToolsEnhancer = composeWithDevTools({
    realtime: true,
})
const store = createStore(reducers, devToolsEnhancer(applyMiddleware(...middlewares)))
const dispatch = store.dispatch
console.log('redux store configured ')
dispatch(initializeApp()).then(async config => {

    console.log('loaded config', config)
    // const loggedIn = dispatch(await loginWithGoogleFromCache())
    // dispatch(await loadUserIfExists())
    // dispatch(await loadUserFromCache())
    // if (loggedIn) {
    //     console.log('logged in with google from cache')
    // }
    //initializeApp the fitbit tokens
    // initializeFitbit().then(tokens => {
    //     console.log('successfully initialized the fitbit service', tokens)
    // })
    // dispatch(initializeUser())

})


const Main = () => {
    return <Provider store={store}>
        <ModalStackNavigator/>
    </Provider>
}

export default Main