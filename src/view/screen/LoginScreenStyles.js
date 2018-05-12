import {StyleSheet} from 'react-native'
import {Constants} from 'expo'

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: Constants.statusBarHeight,
    },
    verticalCenterContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    centerText: {
        textAlign: 'center',
    },
})