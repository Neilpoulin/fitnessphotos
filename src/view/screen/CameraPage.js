import React from 'react'
import PropTypes from 'prop-types'
import {Text, View, TouchableOpacity, Button} from 'react-native'
import {Camera, Permissions, FileSystem} from 'expo'
import CameraView from '../organism/CameraView'
import {navigationProp} from 'util/PropTypes'

export default class CameraPage extends React.Component {
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
    }

    static propTypes = {
        closeCamera: PropTypes.func,
        navigation: navigationProp,
        handlePhoto: PropTypes.func,
    }

    async componentWillMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA)
        this.setState({hasCameraPermission: status === 'granted'})
    }

    render() {
        const {hasCameraPermission} = this.state
        let $close = this.props.closeCamera && <Button onPress={this.props.closeCamera} title="Close Camera"/>
        const {navigation} = this.props
        const navParams = navigation.state.params
        const goBack = navigation.goBack

        if (hasCameraPermission === null) {
            return <View/>
        } else if (hasCameraPermission === false) {
            return <Text>
                No access to camera
            </Text>
        } else {

            return (
                <View style={{flex: 1}}>
                    <CameraView
                        handlePhoto={navParams.handlePhoto}
                        onClose={() => {
                            console.log('going back')
                            navigation.goBack()
                        }}
                    />
                </View>
            )
        }
    }
}