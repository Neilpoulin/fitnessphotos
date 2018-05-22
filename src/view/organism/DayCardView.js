import React from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native'
import {cardBackgroundColor, cardView, cardViewActiveOpacity, getViewWidth} from 'style/GlobalStyles'
import {propTypes as dayPropTypes} from 'ducks/day'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {formatDayOfWeekShort} from 'util/TimeUtil'
import styles from './DayCardViewStyles'
import {SET_DATE} from '../../ducks/dayInput'
import {DAY_INPUT_SCREEN} from 'view/nav/Routes'
import {getCardWidth, getScaledImageSize} from 'view/organism/DayCardViewStyles'
import FullWidthImage from 'view/organism/FullWidthImage'
import {getDayState} from 'selector/daySelector'

class DayCardView extends React.Component {
    static propTypes = {
        day: PropTypes.shape(dayPropTypes),
        //actions
        editDay: PropTypes.func,
    }

    state = {
        imageError: false,
        isPressed: false,
    }

    _setIsPressed(isPressed) {
        this.setState({isPressed})
    }

    _handleImageError() {
        this.setState({imageError: true})
    }

    render() {
        const {
            day,
            editDay,
        } = this.props

        const {
            isPressed,
        } = this.state

        return <TouchableHighlight onPress={() => editDay()}
            style={[styles.container,
                cardView.container,
                isPressed ? cardView.containerPressed : {},
            ]}
            onPressIn={() => this._setIsPressed(true)}
            onPressOut={() => this._setIsPressed(false)}
            activeOpacity={cardViewActiveOpacity}>
            <View style={[{backgroundColor: cardBackgroundColor}, cardView.containerContent]}>
                <View style={[styles.padded]}>
                    <Text style={styles.title}>{formatDayOfWeekShort(day.dayKey, false)}</Text>
                </View>
                <FullWidthImage
                    display-if={day.imageUri}
                    source={{uri: day.imageUri}}
                    dimensions={day.imageSize}
                    onError={() => this._handleImageError()}
                />
                <View style={[styles.rows, styles.padded]}>
                    <View style={styles.columns}>
                        <View style={[styles.columns, styles.scoresContainer]}>
                            <View style={[styles.scoreView]}>
                                <View style={[styles.scoreCircle, styles[`score${day.scores.body}View`]]}>
                                    <Text style={styles[`score${day.scores.body}CircleText`]}>{day.scores.body}</Text>
                                    <Text style={[styles.scoreLabel, styles[`score${day.scores.body}CircleText`]]}>Body</Text>
                                </View>
                            </View>
                            <View style={[styles.scoreView]}>
                                <View style={[styles.scoreCircle, styles[`score${day.scores.food}View`]]}>
                                    <Text style={styles[`score${day.scores.food}CircleText`]}>{day.scores.food}</Text>
                                    <Text style={[styles.scoreLabel, styles[`score${day.scores.food}CircleText`]]}>Food</Text>
                                </View>

                            </View>
                            <View style={[styles.scoreView]}>
                                <View style={[styles.scoreCircle, styles[`score${day.scores.mind}View`]]}>
                                    <Text style={styles[`score${day.scores.mind}CircleText`]}>{day.scores.mind}</Text>
                                    <Text style={[styles.scoreLabel, styles[`score${day.scores.mind}CircleText`]]}>Mind</Text>
                                </View>

                            </View>
                        </View>
                    </View>
                </View>

                <View display-if={day.steps}>
                    <Text>{day.steps.toLocaleString()} steps</Text>
                </View>
                <View style={styles.weightContainer} display-if={day.weight}>
                    <Text style={styles.weightText} display-if={day.weight}>{day.weight} lbs</Text>
                </View>
            </View>
        </TouchableHighlight>
    }

}

const mapStateToProps = (state, ownProps) => {
    const {dayKey} = ownProps
    const dayState = getDayState(state, {dayKey})
    return {
        day: dayState.toJS(),
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        editDay: () => {
            let dayKey = ownProps.dayKey
            dispatch({
                type: SET_DATE,
                dayKey,
                payload: dayKey,
            })
            ownProps.navigation.navigate(DAY_INPUT_SCREEN)
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DayCardView)