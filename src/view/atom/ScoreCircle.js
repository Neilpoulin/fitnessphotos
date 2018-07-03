import React from 'react'
import {
    View,
    Text,
} from 'react-native'
import PropTypes from 'prop-types'
import styles from './ScoreCircleStyles'

function getDisplayValue(score) {
    switch (score) {
        case 1:
            return ':-('
        case 2:
            return ':-|'
        case 3:
            return ':-)'
        default:
            return ''
    }
}


class ScoreCircle extends React.Component {
    static propTypes = {
        score: PropTypes.number,
        selected: PropTypes.boolean,
    }


    render() {
        const {score, selected} = this.props

        let colorStyle = selected ? [styles[`selected${score}`], styles.selected] : []
        let labelStyle = selected ? [styles.selected] : []
        return <View style={[styles.container, ...colorStyle]}>
            <Text style={[styles.label, ...labelStyle]}>{getDisplayValue(score)}</Text>

        </View>
    }

}

export default ScoreCircle