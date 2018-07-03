import React from 'react'
import {
    View,
    Text,
} from 'react-native'
import PropTypes from 'prop-types'
import styles from './ScoreCircleStyles'
import {getExpressiveValue} from 'util/ScoreUtil'

class ScoreCircle extends React.Component {
    static propTypes = {
        score: PropTypes.number,
        selected: PropTypes.bool,
    }


    render() {
        const {score, selected} = this.props

        let colorStyle = selected ? [styles[`selected${score}`], styles.selected] : []
        let labelStyle = selected ? [styles.selected] : []
        return <View style={[styles.container, ...colorStyle]}>
            <Text style={[styles.label, ...labelStyle]}>{getExpressiveValue(score)}</Text>

        </View>
    }

}

export default ScoreCircle