import React from 'react'
import {TabNavigator} from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import PhotoViewerPage from 'view/screen/PhotoViewerPage'
import CameraPage from 'view/screen/CameraPage'
import DayInput from 'view/screen/DayInput'

const AppTabNavigation = TabNavigator({
    Photos: {
        screen: PhotoViewerPage,
        navigationOptions: {
            tabBarLabel: 'Photos',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={focused ? 'ios-photos' : 'ios-photos-outline'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
        },
    },
    Camera: {
        screen: CameraPage,
        navigationOptions: {
            tabBarLabel: 'Camera',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={focused ? 'ios-camera' : 'ios-camera-outline'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
        },
    },
    DayInput: {
        screen: DayInput,
        navigationOptions: {
            tabBarLabel: 'Add',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={focused ? 'ios-add' : 'ios-add'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    }
})

export default AppTabNavigation