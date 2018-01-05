import {combineReducers} from 'redux'
import days from './days'
import config from './config'

export default combineReducers([
    config,
    days,
])