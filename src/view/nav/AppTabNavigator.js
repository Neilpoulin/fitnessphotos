/* eslint-disable react/prop-types */
import React from 'react'
import {TabNavigator} from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import DayInput from 'view/screen/DayInputScreen'
import PhotoViewerPage from 'view/screen/PhotoViewerPage'
import DevScreen from 'view/screen/DevScreen'
import FeedScreen from 'view/screen/FeedScreen'

const navigatorConfig = {
    initialRouteName: 'Feed',
    backBehavior: 'none'
}

const AppTabNavigator = TabNavigator({
    Feed: {
        screen: FeedScreen,
        tabBarLabel: 'Feed',
        // swipeEnabled: true,
        navigationOptions: {
            tabBarLabel: 'Feed',
            // swipeEnabled: true,
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={focused ? 'ios-albums' : 'ios-albums-outline'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
        },
    },
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
    },
    DevScreen: {
        screen: DevScreen,
        navigationOptions: {
            tabBarLabel: 'Dev',
            // swipeEnabled: true,
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={focused ? 'ios-settings' : 'ios-settings-outline'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    }
}, navigatorConfig)


export default AppTabNavigator