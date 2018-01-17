import React from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Text,
} from 'react-native'
import {Button} from 'react-native-elements'
import {Button as Link} from 'react-native'
import {connect} from 'react-redux'
import styles from './DayInputScreenStyle'
import {loadAll} from 'ducks/days'
import {loginWithFitbit} from 'ducks/user'

import {loadAllDays, deleteAll} from 'service/database'

class DevScreen extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        //actions
        refreshState: PropTypes.func,
        connectFitbit: PropTypes.func,
    }

    constructor(props) {
        super(props)
    }

    componentWillMount() {

    }

    render() {
        const {
            refreshState,
            connectFitbit,
            user,
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

            <View>
                <Button onPress={() => connectFitbit()} title='Login With Fitbit'/>
                <View>
                    <Text display-if={user.isLoading}>Loading...</Text>
                    <Text display-if={user.fitbit.userId}>UserID = {user.fitbit.userId}</Text>
                </View>
            </View>
        </View>
    }

}

const mapStateToProps = (state, ownProps) => {
    let user = state.user.toJS()
    return {
        user
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        refreshState: () => {
            dispatch(loadAll())
        },
        connectFitbit: () => {
            dispatch(loginWithFitbit())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DevScreen)