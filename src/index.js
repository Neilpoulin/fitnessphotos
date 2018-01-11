import React from 'react'
import {Provider} from 'react-redux'
import reducers from './ducks'
import thunkMiddleware from 'redux-thunk'
import immutableAction from './middleware/immutable-action'
import {createStore, applyMiddleware} from 'redux'
import {initialize} from 'ducks/config'
import {composeWithDevTools} from 'remote-redux-devtools'
import ModalStackNavigator from 'view/nav/ModalStackNavigator'
import {startDb} from 'service/database';

console.log('attempting to set up store')
let middlewares = [thunkMiddleware, immutableAction]
let devToolsEnhancer = composeWithDevTools({realtime: true})
const store = createStore(reducers, devToolsEnhancer(applyMiddleware(...middlewares)))

startDb(store.dispatch)

store.dispatch(initialize()).then(config => {
    console.log('loaded config', config)
})


const Main = () => {
    return <Provider store={store}>
        <ModalStackNavigator/>
    </Provider>
}

export default Main