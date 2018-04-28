import React from 'react'
import {Provider} from 'react-redux'
import reducers from './ducks'
import thunkMiddleware from 'redux-thunk'
import immutableAction from './middleware/immutable-action'
import {applyMiddleware, createStore} from 'redux'
import {initialize as initializeConfig} from 'ducks/config'
import {composeWithDevTools} from 'remote-redux-devtools'
import ModalStackNavigator from 'view/nav/ModalStackNavigator'
import * as firebase from 'firebase'
import 'firebase/firestore'

import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
} from 'react-native-dotenv'

console.log('attempting to set up store')
let middlewares = [thunkMiddleware, immutableAction]
let devToolsEnhancer = composeWithDevTools({realtime: true})
const store = createStore(reducers, devToolsEnhancer(applyMiddleware(...middlewares)))
const dispatch = store.dispatch


// Initialize Firebase
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    projectId: FIREBASE_PROJECT_ID,
}
console.log('initializing firebase app')
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
db.settings({
    timestampsInSnapshots: true,
})
console.log('initilzed firestore db')
// startDb(store.dispatch)

dispatch(initializeConfig()).then(config => {
    console.log('loaded config', config)
    //initialize the fitbit tokens
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