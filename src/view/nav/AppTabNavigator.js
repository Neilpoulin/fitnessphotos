/* eslint-disable react/prop-types,react/display-name */
import React from 'react'
import {TabNavigator} from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DayInput from 'view/screen/DayInputScreen'
import ChartScreen from 'view/screen/ChartScreen'
import ProfileScreen from 'view/screen/ProfileScreen'
import FeedScreen from 'view/screen/FeedScreen'
import * as Routes from './Routes'


const navigatorConfig = {
    initialRouteName: 'Feed',
    backBehavior: 'none',
}

const AppTabNavigator = TabNavigator({
    [Routes.FEED_SCREEN]: {
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
    [Routes.DAY_INPUT_SCREEN]: {
        screen: DayInput,
        navigationOptions: ({navigation}) => ({
            tabBarLabel: 'Add',

            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={focused ? 'ios-add' : 'ios-add'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
        }),
    },
    [Routes.CHART_SCREEN]: {
        screen: ChartScreen,
        navigationOptions: {
            tabBarLabel: 'Charts',
            // swipeEnabled: true,
            tabBarIcon: ({tintColor, focused}) => (
                <MaterialCommunityIcons
                    name={'chart-areaspline'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
        },
    },
    [Routes.PROFILE_SCREEN]: {
        screen: ProfileScreen,
        navigationOptions: {
            tabBarLabel: 'Profile',
            // swipeEnabled: true,
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={focused ? 'ios-person' : 'ios-person-outline'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
        },
    },
}, navigatorConfig)


export default AppTabNavigator