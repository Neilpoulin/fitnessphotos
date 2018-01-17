import React from 'react'
import {StackNavigator} from 'react-navigation'
import CameraPage from 'view/screen/CameraPage'
import AppTabNavigations from './AppTabNavigator'
import * as Routes from './Routes'

const navigatorConfig = {
    initialRouteName: 'Charts',
    mode: 'modal',
    headerMode: 'none',

}

const ModalStackNavigator = StackNavigator({
    [Routes.CHART_SCREEN]: {
        screen: AppTabNavigations,
        // path: 'charts'
    },
    [Routes.CAMERA_SCREEN]: {
        screen: CameraPage,
        // path: 'camera'
    }
}, navigatorConfig)

export default ModalStackNavigator