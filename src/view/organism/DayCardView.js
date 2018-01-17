import React from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native'
import {propTypes as dayPropTypes} from 'ducks/day'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {formatDayOfWeekShort} from 'util/TimeUtil'
import styles from './DayCardViewStyles'
import {SET_DATE} from '../../ducks/dayInput';
import {DAY_INPUT_SCREEN} from 'view/nav/Routes'

class DayCardView extends React.Component {
    static propTypes = {
        day: PropTypes.shape(dayPropTypes),
        //actions
        editDay: PropTypes.func,
    }

    render() {
        const {
            day,
            editDay
        } = this.props
        return <TouchableOpacity onPress={() => editDay()}><View style={styles.container}>
            <View style={styles.columns}>
                <View style={[styles.rows, styles.padded]}>
                    <View style={styles.marginBottom}>
                        <Text style={styles.title}>{formatDayOfWeekShort(day.dayKey, false)}</Text>
                    </View>
                    <View style={styles.columns}>
                        <View style={[styles.columns, styles.scoresContainer]}>
                            <View style={[styles.scoreView]}>
                                <View style={[styles.scoreCircle, styles[`score${day.scores.body}View`]]}>
                                    <Text style={styles[`score${day.scores.body}CircleText`]}>{day.scores.body}</Text>
                                </View>
                                <Text style={styles.scoreLabel}>Body</Text>
                            </View>
                            <View style={[styles.scoreView]}>
                                <View style={[styles.scoreCircle, styles[`score${day.scores.food}View`]]}>
                                    <Text style={styles[`score${day.scores.food}CircleText`]}>{day.scores.food}</Text>
                                </View>
                                <Text style={styles.scoreLabel}>Food</Text>
                            </View>
                            <View style={[styles.scoreView]}>
                                <View style={[styles.scoreCircle, styles[`score${day.scores.mind}View`]]}>
                                    <Text style={styles[`score${day.scores.mind}CircleText`]}>{day.scores.mind}</Text>
                                </View>
                                <Text style={styles.scoreLabel}>Mind</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.imageContainer}>
                    <Image display-if={day.imageUri} source={{uri: day.imageUri}} style={styles.image}
                        resizeMode={'contain'}/>
                    <View style={[styles.image, styles.imageEmpty]} display-if={!day.imageUri}>
                        <Text>No Image</Text>
                    </View>
                    <View style={styles.weightContainer} display-if={day.weight}>
                        <Text style={styles.weightText}>{day.weight.toFixed(1)} lbs</Text>
                    </View>
                </View>
            </View>
        </View>
        </TouchableOpacity>
    }

}

const mapStateToProps = (state, ownProps) => {
    return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        editDay: () => {
            let dayKey = ownProps.day.dayKey
            dispatch({
                type: SET_DATE,
                dayKey,
                payload: dayKey
            })
            ownProps.navigation.navigate(DAY_INPUT_SCREEN)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DayCardView)