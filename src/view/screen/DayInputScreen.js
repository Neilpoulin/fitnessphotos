import React from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Text,
    Image,
} from 'react-native'
import Immutable from 'immutable'
import {Button, Slider} from 'react-native-elements'
import {Button as Link} from 'react-native'
import {connect} from 'react-redux'
import {formatLongDate} from 'util/TimeUtil'
import {goToNextDate, goToPreviousDate} from 'ducks/dayInput'
import styles from './DayInputScreenStyle'
import Ionicon from 'react-native-vector-icons/Ionicons'
import {openCamera} from 'ducks/camera'
import {FileSystem, ImagePicker} from 'expo'
import uuid from 'uuid'
import {setBodyScore, setMindScore, setFoodScore, setImage, setEditingImage} from 'ducks/dayInput'
import {formatScore} from 'util/ScoreUtil'
import {getDayState} from 'selector/daySelector';

class DayInput extends React.Component {
    static propTypes = {
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
        image: PropTypes.shape({
            uri: PropTypes.string,
            height: PropTypes.number,
            width: PropTypes.number,
        }),
        setBody: PropTypes.func,
        setFood: PropTypes.func,
        setMind: PropTypes.func,
        setPhoto: PropTypes.func,
        setImage: PropTypes.func,
        editImage: PropTypes.func,
        editImageDone: PropTypes.func,
        isEditingImage: PropTypes.bool,
    }

    constructor(props) {
        super(props)
        this._pickImage = this._pickImage.bind(this)
        this._takePicture = this._takePicture.bind(this)
    }

    _pickImage = async () => {
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

    };

    _takePicture = async () => {
        let imageSetter = this.props.setPhoto
        this.props.navigation.navigate('Camera', {
            handlePhoto: (photo) => {
                console.log('got photo', photo)
                imageSetter(photo)
            }
        })
    }

    render() {
        const {
            dateFormatted,
            nextDay,
            previousDay,
            openCamera,
            scores,
            setBody,
            setMind,
            setFood,
            image,
            editImage,
            editImageDone,
            isEditingImage,
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
                    <Text style={styles.dayTitle}>{dateFormatted}</Text>
                    <Ionicon
                        name={'ios-arrow-forward'}
                        size={42}
                        style={styles.topNavButton}
                        onPress={nextDay}
                    />
                </View>
            </View>
            <View style={styles.photoContainer}>
                <View style={styles.actionsFlexbox} display-if={!image || isEditingImage}>
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
                <View display-if={image && !isEditingImage} style={styles.photoFlexbox}>
                    <Image source={{uri: image.uri}} style={{height: 250, width: 250}} resizeMode={'contain'}/>
                    <Link title={'Change Image'} onPress={editImage}/>
                </View>
            </View>
            <View
                style={styles.sliderContainer}>
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
    let dayState = getDayState(state, page.get('date'))

    let image = dayState.get('image')
    if (image) {
        image = image.toJS()
    }

    console.log('image is ', image)
    return {
        dateFormatted: formatLongDate(page.get('date')),
        scores: dayState.get('scores').toJS(),
        image,
        isEditingImage: page.get('isEditingImage'),
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        nextDay: () => {
            dispatch(goToNextDate())
        },
        previousDay: () => {
            dispatch(goToPreviousDate())
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
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DayInput)