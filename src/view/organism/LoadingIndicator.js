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
        inline: PropTypes.bool,
    }

    static defaultProps = {
        color: textLightColor,
        inline: false,
    }

    render() {
        const {text, color, size, inline} = this.props
        let style = inline ? [styles.horizontalCenter] : [styles.verticalCenterContainer]

        return <View style={style}>
            <ActivityIndicator size={size} color={color}/>
            <Text display-if={text} style={[styles.centerAlignText, {
                color: color,
                fontSize: 15,
            }]}>{text}</Text>
        </View>
    }

}

export default LoadingIndicator