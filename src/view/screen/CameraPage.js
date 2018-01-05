import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity, Button } from 'react-native';
import { Camera, Permissions, FileSystem } from 'expo';
import CameraView from '../organism/CameraView'

export default class CameraPage extends React.Component {
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
    };

    static propTypes = {
        closeCamera: PropTypes.func
    };

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    render() {
        const { hasCameraPermission } = this.state;
        let $close = this.props.closeCamera && <Button onPress={this.props.closeCamera} title="Close Camera"/>

        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>
                No access to camera
            </Text>;
        } else {

            return (
                <View style={{ flex: 1 }}>
                    <CameraView/>
                </View>
            );
        }
    }
}