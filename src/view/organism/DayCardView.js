import React from 'react'
import {
    View,
    Text,
    Image
} from 'react-native'
import {propTypes as dayPropTypes} from 'ducks/day';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {formatDayOfWeekShort} from 'util/TimeUtil'
import styles from './DayCardViewStyles'

class DayCardView extends React.Component {
    static propTypes = {
        day: PropTypes.shape(dayPropTypes)
    }

    render() {
        const {
            day,
        } = this.props
        return <View style={styles.container}>
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
                <View display-if={day.imageUri} style={styles.imageContainer}>
                    <Image source={{uri: day.imageUri}} style={styles.image} resizeMode={'contain'}/>
                </View>
            </View>
        </View>

    }

}

const mapStateToProps = (state, ownProps) => {
    return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(DayCardView)