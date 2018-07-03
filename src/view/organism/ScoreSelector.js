import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import styles from 'view/organism/ScoreSelectorStyles'
import ScoreCircle from 'view/atom/ScoreCircle'
import {formatScore} from 'util/ScoreUtil'

class ScoreSelector extends React.Component {
    static propTypes = {
        onSelect: PropTypes.func,
        label: PropTypes.string,
        currentValue: PropTypes.number,
    }

    defaultProps = {
        onSelect: (value) => console.log('score changed to ', value),

    }

    render() {
        const {onSelect, label, currentValue} = this.props
        return <View style={styles.container}>
            <Text display-if={label} style={styles.labelContainer}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.labelValue}> {formatScore(currentValue)}</Text>
            </Text>
            <View style={styles.scoreButtonContainer}>
                <TouchableOpacity onPress={() => onSelect(1)}>
                    <ScoreCircle score={1} selected={currentValue === 1}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onSelect(2)}>
                    <ScoreCircle score={2} selected={currentValue === 2}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onSelect(3)}>
                    <ScoreCircle score={3} selected={currentValue === 3}/>
                </TouchableOpacity>
            </View>
        </View>
    }

}

export default ScoreSelector