import React from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Text,
} from 'react-native'
import {Button as Link} from 'react-native'
import {connect} from 'react-redux'
import styles from './DayInputScreenStyle'

import {loadAllDays, deleteAll} from 'service/database'

class DevScreen extends React.Component {
    static propTypes = {
        refreshState: PropTypes.func,
    }

    constructor(props) {
        super(props)
    }

    componentWillMount() {

    }

    render() {
        const {
            refreshState
        } = this.props
        return <View style={styles.container}>
            <Text>Dev Screen</Text>
            <View>
                <Link onPress={refreshState} title={'Refresh All State'}/>
            </View>
            <View>
                <Link onPress={() => loadAllDays()} title={'Load All'}/>
            </View>
            <View>
                <Link onPress={() => deleteAll()} title={'Delete All'}/>
            </View>
        </View>
    }

}

const mapStateToProps = (state, ownProps) => {
    return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        refreshState: () => {
            console.warn('refresh state not implemented yet')
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DevScreen)