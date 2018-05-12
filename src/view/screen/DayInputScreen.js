import React from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Text,
    Image,
} from 'react-native'
import {Button, Slider} from 'react-native-elements'
import {Button as Link} from 'react-native'
import {connect} from 'react-redux'
import {formatLongDate} from 'util/TimeUtil'
import {goToNextDate, goToPreviousDate, setDayKey} from 'ducks/dayInput'
import styles from './DayInputScreenStyle'
import Ionicon from 'react-native-vector-icons/Ionicons'
import {openCamera} from 'ducks/camera'
import {FileSystem, ImagePicker, Permissions} from 'expo'
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
import {formatScore} from 'util/ScoreUtil'
import {getDayState} from 'selector/daySelector'
import {saveDay} from 'ducks/day'
import {getDayKey} from 'util/TimeUtil'
import {CAMERA_SCREEN} from 'view/nav/Routes'

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
        //actions
        today: PropTypes.func,
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
            console.log(result)

            let from = result.uri
            let imageId = uuid.v4()
            let parts = from ? from.split('/') : []
            if (!parts.length > 0) {
                return
            }
            let filename = parts[parts.length - 1]

            let to = `${FileSystem.documentDirectory}photos/${imageId}-${filename}`
            FileSystem.copyAsync({
                from, to,
            }).then(result => {
                console.log('successfully copied image', result)
                // this._loadImages()
                imageSetter({
                    uri: to,
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
                console.log('got photo', photo)
                imageSetter(photo)
            },
        })
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
            //actions
            save,
            dayKey,
            getWeight,
            today,
        } = this.props
        return <View style={styles.container}>
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
                    <Link title={'Today'} onPress={today}/>
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
                    <View>
                        <Image source={{uri: imageUri}} style={{height: 210, width: 250}} resizeMode={'contain'}/>
                    </View>
                    <View>
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
            <View style={styles.sliderContainer}>
                <Slider
                    minimumValue={0}
                    maximumValue={3}
                    step={1}
                    value={scores.body}
                    trackStyle={styles.sliderTrack}
                    thumbStyle={styles.sliderThumb}
                    onValueChange={(value) => setBody(value)}
                />
                <Text>Body: {formatScore(scores.body)}</Text>
            </View>
            <View style={styles.sliderContainer}>
                <Slider
                    minimumValue={0}
                    maximumValue={3}
                    step={1}
                    value={scores.mind}
                    trackStyle={styles.sliderTrack}
                    thumbStyle={styles.sliderThumb}
                    onValueChange={(value) => setMind(value)}/>
                <Text>Mind: {formatScore(scores.mind)}</Text>
            </View>
            <View
                style={styles.sliderContainer}>
                <Slider
                    minimumValue={0}
                    maximumValue={3}
                    step={1}
                    value={scores.food}
                    trackStyle={styles.sliderTrack}
                    thumbStyle={styles.sliderThumb}
                    onValueChange={(value) => setFood(value)}
                />
                <Text>Food: {formatScore(scores.food)}</Text>
            </View>

        </View>
    }

}

const mapStateToProps = (state, ownProps) => {
    let page = state.dayInput
    let dayKey = getDayKey(page.get('date'))
    let dayState = getDayState(state, {dayKey})
    let imageUri = dayState.get('imageUri')
    let steps = dayState.get('steps')

    return {
        dateFormatted: formatLongDate(page.get('date')),
        scores: dayState.get('scores').toJS(),
        weight: dayState.get('weight'),
        imageUri,
        dayKey,
        isEditingImage: page.get('isEditingImage'),
        steps,
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
        setPhoto: (photo) => {
            console.log('setting the photo into state', photo)
            dispatch(setImage(photo))
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