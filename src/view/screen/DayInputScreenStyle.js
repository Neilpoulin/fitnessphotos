import {StyleSheet} from 'react-native'
import {Constants} from 'expo'

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Constants.statusBarHeight,
        flexDirection: 'column',
        // alignItems: 'flex-start',
        // justifyContent: 'center',
    },
    dayTitle: {
        fontSize: 22,
        flex: 2,
    },
    topNavContainer: {
        height: 90,
    },
    topNavButton: {
        color: '#007AFF',
    },
    topNav: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // height: 40,
        padding: 10,
    },
    photoContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        height: 250,
    },
    actionsFlexbox: {
        alignItems: 'stretch',
        justifyContent: 'center',
        marginBottom: 50,
        // flex: 1,
    },
    photoFlexbox: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginBottom: 100,
    },

    buttonContainer: {
        marginBottom: 20,
    },
    button: {
        fontSize: 28,

    },
    scoreContainer: {
        padding: 20,
    },
    sliderContainer: {
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    sliderTrack: {
        // backgroundColor: 'green',
    },
    sliderThumb: {
        backgroundColor: '#b3b3b3',
        shadowColor: '#3f3f3f',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowRadius: 1,
        shadowOpacity: .7,
    },

})