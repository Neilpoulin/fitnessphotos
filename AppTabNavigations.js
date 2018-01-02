import React from 'react'
import { TabNavigator } from 'react-navigation';
import {View, Text} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import PhotoViewerPage from './PhotoViewerPage'
import CameraPage from './CameraPage'
const HomeScreen = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
    </View>
);

const ProfileScreen = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Profile Screen</Text>
    </View>
);


const AppTabNavigation = TabNavigator({
    Photos: {
        screen: PhotoViewerPage,
        navigationOptions: {
            tabBarLabel: 'Photos',
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={focused ? 'ios-photos' : 'ios-photos-outline'}
                    size={26}
                    style={{ color: tintColor }}
                />
            ),
        },
    },
    Camera: {
        screen: CameraPage,
        navigationOptions: {
            tabBarLabel: 'Camera',
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={focused ? 'ios-camera' : 'ios-camera-outline'}
                    size={26}
                    style={{ color: tintColor }}
                />
            ),
        },
    },
});

export default AppTabNavigation;