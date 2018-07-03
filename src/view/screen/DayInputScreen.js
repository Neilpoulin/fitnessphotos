import React from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Text,
    Image,
    ScrollView,
} from 'react-native'
import Immutable from 'immutable'
import {Button} from 'react-native-elements'
import {Button as Link} from 'react-native'
import {connect} from 'react-redux'
import {formatLongDate} from 'util/TimeUtil'
import {goToNextDate, goToPreviousDate, setImageLoadError, uploadImage} from 'ducks/dayInput'
import styles from './DayInputScreenStyle'
import Ionicon from 'react-native-vector-icons/Ionicons'
import {openCamera} from 'ducks/camera'
import {ImagePicker, Permissions, FileSystem} from 'expo'
import uuid from 'uuid'
import {
    setBodyScore,
    setMindScore,
    setFoodScore,
    setImage,
    setEditingImage,
    loadCurrentDay,
    goToToday,
} from 'ducks/dayInput'
import {getDayState} from 'selector/daySelector'
import {saveDay} from 'ducks/day'
import {getDayKey} from 'util/TimeUtil'
import {CAMERA_SCREEN} from 'view/nav/Routes'
import {SafeAreaView} from 'react-navigation'
import {
    border,
    textSuccessColor,
    textDarkColor,
} from 'style/GlobalStyles'
import LoadingIndicator from 'view/organism/LoadingIndicator'
import Progress from 'view/organism/Progress'
import ScoreSelector from 'view/organism/ScoreSelector'

class DayInput extends React.Component {
    static propTypes = {
        //ownprops
        screenProps: PropTypes.shape({
            overrideDayKey: PropTypes.string,
        }),
        //state props
        dayKey: PropTypes.string,
        dateFormatted: PropTypes.string,
        foodSelections: PropTypes.arrayOf(PropTypes.any),
        mindSelections: PropTypes.arrayOf(PropTypes.any),
        bodySelections: PropTypes.arrayOf(PropTypes.any),
        scores: PropTypes.shape({
            mind: PropTypes.number,
            body: PropTypes.number,
            food: PropTypes.number,
        }),
        nextDay: PropTypes.func.isRequired,
        previousDay: PropTypes.func.isRequired,
        navigation: PropTypes.shape({
            navigate: PropTypes.func,
        }),
        openCamera: PropTypes.func,
        imageUri: PropTypes.string,
        setBody: PropTypes.func,
        setFood: PropTypes.func,
        setMind: PropTypes.func,
        setPhoto: PropTypes.func,
        setImage: PropTypes.func,
        editImage: PropTypes.func,
        editImageDone: PropTypes.func,
        isEditingImage: PropTypes.bool,
        loadScreen: PropTypes.func,
        save: PropTypes.func,
        getWeight: PropTypes.func,
        weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        steps: PropTypes.number,
        isUploading: PropTypes.bool,
        uploadSuccess: PropTypes.bool,
        uploadError: PropTypes.any,
        imageDownloadURL: PropTypes.string,
        imageLoadError: PropTypes.bool,
        isLoading: PropTypes.bool,
        imageUploadProgress: PropTypes.number,
        //actions
        today: PropTypes.func,
        setImageError: PropTypes.func,
    }

    //TODO: fix the image error case for this component.
    // Component state carries over when you change days, so this needs to get updated basedon the current values
    state = {
        imageError: false,
    }

    constructor(props) {
        super(props)
        this._pickImage = this._pickImage.bind(this)
        this._takePicture = this._takePicture.bind(this)
    }

    componentWillMount() {
        if (this.props.loadScreen) {
            this.props.loadScreen()
        }
    }


    _pickImage = async () => {
        try {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            console.log('camera roll status = ', status)

            if (status !== 'granted') {
                console.warn('no permissions granted, returning')
                return
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: false,
                // aspect: [4, 3],
            })
            let imageSetter = this.props.setPhoto
            console.log('got image from camera roll', result)

            let from = result.uri
            let height = result.height
            let width = result.width
            // let imageId = uuid.v4()
            let parts = from ? from.split('/') : []
            let filename = null
            if (!parts.length > 0) {
                return
            } else {
                filename = parts[parts.length - 1]
            }

            let imageId = uuid()
            let to = `${FileSystem.documentDirectory}photos/${imageId}-${filename}`
            return FileSystem.copyAsync({
                from, to,
            }).then(() => {
                console.log('successfully copied image')
                // this._loadImages()

                return imageSetter({
                    uri: to,
                    height,
                    width,
                    filename,
                    localUri: to,
                })
            })
        } catch (e) {
            console.error('something went wrong trying to open the camera roll', e)
        }

    }

    _takePicture = async () => {
        let imageSetter = this.props.setPhoto
        this.props.navigation.navigate(CAMERA_SCREEN, {
            handlePhoto: (photo) => {
                console.log('got photo from camera', photo)
                imageSetter(photo)
            },
        })
    }

    _handleImageError(e) {
        // console.error('something went wrong with the image handler', e)
        this.props.setImageError(true)
    }

    render() {
        const {
            dateFormatted,
            nextDay,
            previousDay,
            scores,
            setBody,
            setMind,
            setFood,
            imageUri,
            editImage,
            editImageDone,
            isEditingImage,
            weight,
            steps,
            isUploading,
            uploadSuccess,
            uploadError,
            imageDownloadURL,
            isLoading,
            imageUploadProgress,
            //actions
            save,
            dayKey,
            getWeight,
            today,
            imageLoadError,
        } = this.props

        if (isLoading) {
            return <LoadingIndicator text={'Loading'}/>
        }

        return <SafeAreaView style={styles.container}>
            <View style={styles.topNavContainer}>
                <View style={styles.topNav}>
                    <Ionicon
                        name={'ios-arrow-back'}
                        size={42}
                        style={styles.topNavButton}
                        onPress={previousDay}
                    />

                    <View>
                        <Text style={styles.dayTitle}>{dateFormatted}</Text>
                    </View>
                    <Ionicon
                        name={'ios-arrow-forward'}
                        size={42}
                        style={styles.topNavButton}
                        onPress={nextDay}
                    />
                </View>
                <View>
                    <Link title={'Go to Today'} onPress={today}/>
                </View>
            </View>
            <View style={styles.photoContainer}>
                <View style={styles.actionsFlexbox} display-if={!imageUri || isEditingImage}>
                    <View style={styles.buttonContainer}>
                        <Button
                            title={'Take Photo'}
                            icon={{name: 'ios-camera', size: styles.button.fontSize, type: 'ionicon'}}
                            onPress={this._takePicture}/>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Pick an image from camera roll"
                            icon={{name: 'md-photos', size: styles.button.fontSize, type: 'ionicon'}}
                            onPress={this._pickImage}
                        />
                    </View>
                    <View display-if={isEditingImage}>
                        <Link title={'Cancel Edit'} onPress={editImageDone}/>
                    </View>
                </View>
                <View display-if={imageUri && !isEditingImage} style={styles.photoFlexbox}>
                    <View display-if={!imageLoadError}>
                        <Image source={{uri: imageUri}}
                            style={{height: 210, width: 250}}
                            onError={() => this._handleImageError()}
                            resizeMode={'contain'}/>
                        <View display-if={isUploading} style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            backgroundColor: 'rgba(255, 255, 255, .6)',
                            justifyContent: 'center',
                        }}>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginBottom: 15,
                            }}>
                                <LoadingIndicator text={'Uploading Image...'} inline={true} color={textDarkColor}/>
                            </View>

                            <Progress progress={imageUploadProgress} trackTintColor={textDarkColor} progressTintColor={textSuccessColor}/>
                        </View>
                    </View>


                    <View display-if={imageLoadError} style={[border.solid]}>
                        <Text>Failed to load image</Text>
                    </View>
                    <View display-if={!isUploading}>
                        <Link title={'Change Image'} onPress={editImage}/>
                    </View>
                </View>
            </View>
            <View display-if={weight}>
                <Text>Weight: {weight}</Text>
            </View>
            <View display-if={steps}>
                <Text>Steps: {steps}</Text>
            </View>

            <ScrollView style={styles.scoreContainer}>
                <ScoreSelector onSelect={(value) => setBody(value)}
                    currentValue={scores.body}
                    label={'Body'}/>
                <ScoreSelector onSelect={(value) => setFood(value)}
                    currentValue={scores.food}
                    label={'Food'}/>
                <ScoreSelector onSelect={(value) => setMind(value)}
                    currentValue={scores.mind}
                    label={'Mind'}/>
            </ScrollView>
        </SafeAreaView>
    }

}

const mapStateToProps = (state, ownProps) => {
    let page = state.dayInput
    let dayKey = getDayKey(page.get('date'))
    let dayState = getDayState(state, {dayKey})
    let imageUri = dayState.get('imageUri')
    let steps = dayState.get('steps')
    let uploadInfo = page.getIn(['uploadActivity', imageUri], Immutable.Map())
    return {
        dateFormatted: formatLongDate(page.get('date')),
        scores: dayState.get('scores').toJS(),
        weight: dayState.get('weight'),
        imageUri,
        dayKey,
        isEditingImage: page.get('isEditingImage'),
        steps,
        isLoading: dayState.get('isLoading'),
        isUploading: page.get('imageIsUploading', false),
        uploadSuccess: page.get('imageUploadSuccess', false),
        uploadError: uploadInfo.get('imageUploadError', null),
        imageDownloadURL: uploadInfo.get('imageDownloadURL', null),
        imageLoadError: dayState.get('imageLoadError', false),
        imageUploadProgress: page.get('imageUploadProgress', 0),
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadScreen: () => {
            dispatch(loadCurrentDay())
        },
        nextDay: () => {
            dispatch(goToNextDate())
            dispatch(setEditingImage(false))
        },
        previousDay: () => {
            dispatch(goToPreviousDate())
            dispatch(setEditingImage(false))
        },
        today: () => {
            dispatch(goToToday())
        },
        setImageError: (error) => {
            console.log('image error', error)
            dispatch(setImageLoadError(error))
        },
        setPhoto: async (photo) => {
            console.log('setting the photo into state', photo)
            dispatch(setImage(photo))
            dispatch(uploadImage(photo))
            dispatch(setEditingImage(false))
        },
        openCamera: () => {
            dispatch(openCamera())
        },
        setMind: (score) => {
            dispatch(setMindScore(score))
        },
        setBody: (score) => {
            dispatch(setBodyScore(score))
        },
        setFood: (score) => {
            dispatch(setFoodScore(score))
        },
        editImage: () => {
            dispatch(setEditingImage(true))
        },
        editImageDone: () => {
            dispatch(setEditingImage(false))
        },
        save: (dayKey) => {
            dispatch(saveDay(dayKey))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DayInput)