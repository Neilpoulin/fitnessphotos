import {combineReducers} from 'redux'
import days from './days'
import config from './config'
import dayInput from './dayInput'
import camera from './camera'
import user from './user'

export default combineReducers({
    camera,
    config,
    dayInput,
    days,
    user,
})