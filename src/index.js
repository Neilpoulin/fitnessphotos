import React from 'react'
import {Provider} from 'react-redux'
import AppTabNavigation from 'view/nav/AppTabNavigator'
import {View} from 'react-native'
import reducers from './ducks'
import thunkMiddleware from 'redux-thunk'
import immutableAction from './middleware/immutable-action'
import {createStore, applyMiddleware, compose} from 'redux'
import {initialize} from 'ducks/config'
import {composeWithDevTools} from 'remote-redux-devtools'
import ModalStackNavigator from 'view/nav/ModalStackNavigator'

console.log('attempting to set up store')
let middlewares = [thunkMiddleware, immutableAction]
//
let devToolsEnhancer = composeWithDevTools({realtime: true, port: 190000})
const store = createStore(reducers, devToolsEnhancer(applyMiddleware(...middlewares)))
// store.subscribe()
store.dispatch(initialize()).then(config => {
    console.log('loaded config', config)
})


const Main = () => {
    return <Provider store={store}>
        <ModalStackNavigator/>
    </Provider>
}

// const Main = () => {
//     return <Provider store={store}>
//         <AppTabNavigator/>
//     </Provider>
// }


export default Main