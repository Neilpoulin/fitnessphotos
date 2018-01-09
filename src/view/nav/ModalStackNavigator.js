import React from 'react'
import PropTypes from 'prop-types'
import {View} from 'react-native'
import {StackNavigator} from 'react-navigation'
import CameraPage from 'view/screen/CameraPage'
// import TabNavigatorWrapper from './TabNavigatorWrapper'
import AppTabNavigations from './AppTabNavigator'

const navigatorConfig = {
    initialRouteName: 'Charts',
    mode: 'modal',
    headerMode: 'none',

}

const ModalStackNavigator = StackNavigator({
    Charts: {
        screen: AppTabNavigations,
        // path: 'charts'
    },
    Camera: {
        screen: CameraPage,
        // path: 'camera'
    }
}, navigatorConfig)

export default ModalStackNavigator