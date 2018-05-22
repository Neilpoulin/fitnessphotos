import React from 'react'
import {
    View,
    Text,
    ActivityIndicator,
} from 'react-native'
import PropTypes from 'prop-types'
import {textLightColor} from 'style/GlobalStyles'
import styles from 'view/screen/FeedScreenStyles'

class LoadingIndicator extends React.Component {
    static propTypes = {
        text: PropTypes.string,
        size: PropTypes.oneOf(['small', 'large']),
        color: PropTypes.string,
    }

    static defaultProps = {
        color: textLightColor,
    }

    render() {
        const {text, color, size} = this.props
        return <View style={styles.verticalCenterContainer}>
            <ActivityIndicator size={size} color={color}/>
            <Text display-if={text} style={[styles.centerAlignText, {
                color: textLightColor,
                fontSize: 15,
            }]}>{text}</Text>
        </View>
    }

}

export default LoadingIndicator