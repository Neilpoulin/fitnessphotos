import {StyleSheet, Dimensions} from 'react-native'

export const textLightColor = '#75716C'
export const textDarkColor = '#191919'
export const textSuccessColor = '#3d9a00'
export const textWhite = '#FFFFFF'
export const shadowColor = textLightColor
export const cardBackgroundColor = '#fff'
export const borderColor = textLightColor
export const cardBorderRadius = 6
export const cardViewActiveOpacity = .8

export const redColor = '#ef1c27'
export const greenColor = '#19a45d'
export const yellowColor = '#fdf103'


export const containers = StyleSheet.create({
    verticalCenterContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
})

export function getViewWidth() {
    const windowWidth = Dimensions.get('window').width
    return windowWidth
}

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