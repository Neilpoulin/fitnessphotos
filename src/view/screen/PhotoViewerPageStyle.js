import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    imageScrollContainer: {
        height: 280,
    },
    imagesContainer: {
        // flex: 1,
        // width: 200,
        // flexDirection: 'row',
        // alignItems: 'flex-start',
        // justifyContent: 'center',
        // height: 200,
        // width: 300,
        padding: 10,
    },
    selectedImage: {
        width: 120,
        height: 150,
    },
    selectedImageContainer: {
        width: 190,
        height: 200,
        margin: 10,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
    }
});