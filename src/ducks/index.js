import {combineReducers} from 'redux'
import days from './days'
import config from './config'
import dayInput from './dayInput'

export default combineReducers({
    config,
    dayInput,
    days,
})