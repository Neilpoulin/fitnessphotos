import React from 'react'
import {StackNavigator} from 'react-navigation'
import CameraPage from 'view/screen/CameraPage'
import AppTabNavigations from './AppTabNavigator'
import LoginScreen from 'view/screen/LoginScreen'
import * as Routes from './Routes'
import {APP_MAIN} from 'view/nav/Routes'

const initialScreen = Routes.LOGIN_SCREEN

const navigatorConfig = {
    initialRouteName: initialScreen,
    mode: 'card',
    headerMode: 'none',

}

const ModalStackNavigator = StackNavigator({
    [Routes.CAMERA_SCREEN]: {
        screen: CameraPage,
        // path: 'camera'
    },
    [Routes.LOGIN_SCREEN]: {
        screen: LoginScreen,
    },
    [APP_MAIN]: {
        screen: AppTabNavigations,
        // path: 'charts'
    },
}, navigatorConfig)

export default ModalStackNavigator