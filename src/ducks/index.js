import {combineReducers} from 'redux'
import days from './days'
import config from './config'
import dayInput from './dayInput'
import camera from './camera'

export default combineReducers({
    camera,
    config,
    dayInput,
    days,
})