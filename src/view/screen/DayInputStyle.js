import {StyleSheet} from 'react-native';
import {Constants} from 'expo';

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
    },
    topNavContainer: {
        height: 60,
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

    }
});