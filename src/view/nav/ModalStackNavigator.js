import React from 'react'
import {StackNavigator} from 'react-navigation'
import CameraPage from 'view/screen/CameraPage'
import AppTabNavigations from './AppTabNavigator'
import * as Routes from './Routes'

const initialScreen = Routes.PROFILE_SCREEN

const navigatorConfig = {
    initialRouteName: initialScreen,
    mode: 'modal',
    headerMode: 'none',

}

const ModalStackNavigator = StackNavigator({
    [initialScreen]: {
        screen: AppTabNavigations,
        // path: 'charts'
    },
    [Routes.CAMERA_SCREEN]: {
        screen: CameraPage,
        // path: 'camera'
    },
}, navigatorConfig)

export default ModalStackNavigator