import {StyleSheet} from 'react-native'

export const textLightColor = '#75716C'
export const textSuccessColor = '#3d9a00'
export const shadowColor = textLightColor
export const cardBackgroundColor = '#fff'
export const borderColor = textLightColor
export const cardBorderRadius = 6
export const cardViewActiveOpacity = .8

export const containers = StyleSheet.create({
    verticalCenterContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
})

export const cardView = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        borderRadius: cardBorderRadius,
        backgroundColor: cardBackgroundColor,
        shadowColor: shadowColor,
        shadowOpacity: .7,
        shadowRadius: 1,
        shadowOffset: {
            height: 1,
            width: 0,
        },
    },
    containerPressed: {
        shadowOffset: {
            height: 2,
        },
        shadowRadius: 2,
    },
    containerContent: {
        borderRadius: cardBorderRadius,
    },
    activeOpacity: cardViewActiveOpacity,
})

export const border = StyleSheet.create({
    dashed: {
        borderWidth: 1,
        borderColor: borderColor,
        borderStyle: 'dashed',
    },
    solid: {
        borderWidth: 1,
        borderColor: borderColor,
        borderStyle: 'solid',
    },
})