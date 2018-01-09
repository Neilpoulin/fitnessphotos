import {Constants, Camera, FileSystem} from 'expo';
import React from 'react';
import PropTypes from 'prop-types'
import {StyleSheet, Text, View, TouchableOpacity, Slider, Vibration} from 'react-native';
import uuid from 'uuid'

export const landmarkSize = 2;
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from './CameraViewStyle'


const flashModeOrder = {
    off: 'on',
    on: 'auto',
    auto: 'torch',
    torch: 'off',
};

const wbOrder = {
    auto: 'sunny',
    sunny: 'cloudy',
    cloudy: 'shadow',
    shadow: 'fluorescent',
    fluorescent: 'incandescent',
    incandescent: 'auto',
};

export default class CameraView extends React.Component {
    state = {
        flash: 'off',
        zoom: 0,
        autoFocus: 'on',
        depth: 0,
        type: 'back',
        whiteBalance: 'auto',
        ratio: '16:9',
        ratios: [],
        photos: [],
        faces: [],
        photoId: uuid.v4()
    };

    static propTypes = {
        onClose: PropTypes.func,
        handlePhoto: PropTypes.func,
    }

    static defaultProps = {
        onClose: () => {
            console.warn('not implemented ')
        },
        handlePhoto: null,
    }

    _handleClose() {
        console.log('attempting to close camera')
        this.props.onClose()
    }

    componentDidMount() {
        FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photos').catch(() => {
            //do nothing
        })
    }

    getRatios = async function () {
        const ratios = await this.camera.getSupportedRatios();
        return ratios;
    };

    toggleFacing() {
        this.setState({
            type: this.state.type === 'back' ? 'front' : 'back',
        });
    }

    toggleFlash() {
        this.setState({
            flash: flashModeOrder[this.state.flash],
        });
    }

    setRatio(ratio) {
        this.setState({
            ratio,
        });
    }

    toggleWB() {
        this.setState({
            whiteBalance: wbOrder[this.state.whiteBalance],
        });
    }

    toggleFocus() {
        this.setState({
            autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
        });
    }

    zoomOut() {
        this.setState({
            zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
        });
    }

    zoomIn() {
        this.setState({
            zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
        });
    }

    setFocusDepth(depth) {
        this.setState({
            depth,
        });
    }

    takePicture = async function () {
        if (this.camera) {
            let handler = this.props.handlePhoto;
            const toUri = `${FileSystem.documentDirectory}photos/Photo_${this.state.photoId}.jpg`
            this.camera.takePictureAsync().then(data => {
                FileSystem.moveAsync({
                    from: data.uri,
                    to: toUri,
                }).then(() => {
                    console.log('saved image', data);
                    if (handler) {
                        handler({uri: toUri})
                    }

                    this.setState({
                        photoId: uuid.v4(),
                    });
                    Vibration.vibrate();
                    this._handleClose()
                });
            });
        }
    };

    onFacesDetected = ({faces}) => this.setState({faces});
    onFaceDetectionError = state => console.warn('Faces detection error:', state);

    renderFace({bounds, faceID, rollAngle, yawAngle}) {
        return (
            <View
                key={faceID}
                transform={[
                    {perspective: 600},
                    {rotateZ: `${rollAngle.toFixed(0)}deg`},
                    {rotateY: `${yawAngle.toFixed(0)}deg`},
                ]}
                style={[
                    styles.face,
                    {
                        ...bounds.size,
                        left: bounds.origin.x,
                        top: bounds.origin.y,
                    },
                ]}>
                <Text style={styles.faceText}>ID: {faceID}</Text>
                <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
                <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
            </View>
        );
    }

    renderLandmarksOfFace(face) {
        const renderLandmark = position =>
            position && (
                <View
                    style={[
                        styles.landmark,
                        {
                            left: position.x - landmarkSize / 2,
                            top: position.y - landmarkSize / 2,
                        },
                    ]}
                />
            );
        return (
            <View key={`landmarks-${face.faceID}`}>
                {renderLandmark(face.leftEyePosition)}
                {renderLandmark(face.rightEyePosition)}
                {renderLandmark(face.leftEarPosition)}
                {renderLandmark(face.rightEarPosition)}
                {renderLandmark(face.leftCheekPosition)}
                {renderLandmark(face.rightCheekPosition)}
                {renderLandmark(face.leftMouthPosition)}
                {renderLandmark(face.mouthPosition)}
                {renderLandmark(face.rightMouthPosition)}
                {renderLandmark(face.noseBasePosition)}
                {renderLandmark(face.bottomMouthPosition)}
            </View>
        );
    }

    renderFaces() {
        return (
            <View style={styles.facesContainer} pointerEvents="none">
                {this.state.faces.map(this.renderFace)}
            </View>
        );
    }

    renderLandmarks() {
        return (
            <View style={styles.facesContainer} pointerEvents="none">
                {this.state.faces.map(this.renderLandmarksOfFace)}
            </View>
        );
    }

    getFlashIconName() {
        let iconName = 'flash';
        switch (this.state.flash) {
            case 'on':
                iconName = 'flash';
                break;
            case 'off':
                iconName = 'flash-off';
                break;
            case 'torch':
                iconName = 'flashlight';
                break;
            case 'auto':
                iconName = 'flash-auto';
                break;
            default:
                break;
        }

        return iconName;
    }

    renderCamera() {
        return (
            <Camera
                ref={ref => {
                    this.camera = ref;
                }}
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
                type={this.state.type}
                flashMode={this.state.flash}
                autoFocus={this.state.autoFocus}
                zoom={this.state.zoom}
                whiteBalance={this.state.whiteBalance}
                ratio={this.state.ratio}
                faceDetectionLandmarks={Camera.Constants.FaceDetection.Landmarks.all}
                onFacesDetected={this.onFacesDetected}
                onFaceDetectionError={this.onFaceDetectionError}
                focusDepth={this.state.depth}>

                <View
                    style={{
                        flex: 0.85,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                    }}>
                    {/*<Slider*/}
                    {/*style={{ width: 150, marginTop: 15, alignSelf: 'flex-end' }}*/}
                    {/*onValueChange={this.setFocusDepth.bind(this)}*/}
                    {/*step={0.1}*/}
                    {/*disabled={this.state.autoFocus === 'on'}*/}
                    {/*/>*/}
                    <TouchableOpacity style={styles.flipButton} onPress={this._handleClose.bind(this)}>
                        <Ionicons
                            name={'md-close'}
                            size={42}
                            style={{color: 'white'}}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 0.15,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        // alignSelf: 'flex-end',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    {/*<TouchableOpacity*/}
                    {/*style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}*/}
                    {/*onPress={this.zoomIn.bind(this)}>*/}
                    {/*<Text style={styles.flipText}> + </Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity*/}
                    {/*style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}*/}
                    {/*onPress={this.zoomOut.bind(this)}>*/}
                    {/*<Text style={styles.flipText}> - </Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity*/}
                    {/*style={[styles.flipButton, { flex: 0.25, alignSelf: 'flex-end' }]}*/}
                    {/*onPress={this.toggleFocus.bind(this)}>*/}
                    {/*<Text style={styles.flipText}> AF : {this.state.autoFocus} </Text>*/}
                    {/*</TouchableOpacity>*/}
                    <TouchableOpacity style={styles.flipButton} onPress={this.toggleFacing.bind(this)}>
                        <Ionicons
                            name={'ios-reverse-camera-outline'}
                            size={42}
                            style={{color: 'white'}}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.flipButton, styles.picButton]}
                        onPress={this.takePicture.bind(this)}>
                        <Ionicons
                            name={'ios-camera'}
                            size={32}
                            style={{color: 'white'}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.flipButton} onPress={this.toggleFlash.bind(this)}>
                        <MaterialCommunityIcons
                            name={this.getFlashIconName.bind(this)()}
                            size={35}
                            style={{color: 'white'}}
                        />
                    </TouchableOpacity>
                </View>
                {this.renderFaces()}
                {this.renderLandmarks()}
            </Camera>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderCamera()}
            </View>
        );
    }
}
