import React from 'react'
import {TabNavigator} from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import DayInput from 'view/screen/DayInputScreen'
import PhotoViewerPage from 'view/screen/PhotoViewerPage'

const navigatorConfig = {
    initialRouteName: 'DayInput',
    backBehavior: 'none'
}

// Camera: {
//     screen: CameraPage,
//     navigationOptions: {
//         tabBarLabel: 'Camera',
//         tabBarVisible: false,
//         swipeEnabled: true,
//         tabBarIcon: ({tintColor, focused}) => (
//             <Ionicons
//                 name={focused ? 'ios-camera' : 'ios-camera-outline'}
//                 size={26}
//                 style={{color: tintColor}}
//             />
//         ),
//     },
// },

const AppTabNavigator = TabNavigator({
    Photos: {
        screen: PhotoViewerPage,
        navigationOptions: {
            tabBarLabel: 'Photos',
            // swipeEnabled: true,
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={focused ? 'ios-photos' : 'ios-photos-outline'}
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
            // swipeEnabled: true,
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={focused ? 'ios-add' : 'ios-add'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    }
}, navigatorConfig)


export default AppTabNavigator