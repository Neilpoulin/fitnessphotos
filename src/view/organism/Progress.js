import React from 'react'
import {View, Platform, ProgressViewIOS, ProgressBarAndroid} from 'react-native'
import PropTypes from 'prop-types'
import styles from 'view/organism/ProgressViewStyle'

class Progress extends React.Component {
    static propTypes = {
        progress: PropTypes.number.isRequired,
        progressTintColor: PropTypes.string,
        trackTintColor: PropTypes.string,
    }

    render() {
        const {progress, progressTintColor, trackTintColor} = this.props
        return <View style={styles.main}>
            <ProgressBarAndroid styleAttr="Horizontal" progress={progress} indeterminate={false} display-if={Platform.OS === 'android'}/>)
            <ProgressViewIOS progressTintColor={progressTintColor} trackTintColor={trackTintColor} progress={progress} display-if={Platform.OS === 'ios'}/>
        </View>
    }

}

export default Progress