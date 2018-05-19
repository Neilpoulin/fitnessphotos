import React from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Text,
    Button as Link,
    Image,
} from 'react-native'
import {Button} from 'react-native-elements'
import Immutable from 'immutable'
import {connect} from 'react-redux'
import styles from './DayInputScreenStyle'
import {loadAll, loadAllStepsSince} from 'ducks/days'
import {loginWithFitbit, loginWithGoogle, logout as logoutUser} from 'ducks/user'
import {getDateKeyDayAgo} from 'util/TimeUtil'

import {loadAllDays, deleteAll} from 'service/database'
import {navigationProp} from 'util/PropTypes'
import {LOGIN_SCREEN} from 'view/nav/Routes'
import {SafeAreaView} from 'react-navigation'

class ProfileScreen extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        hasGoogle: PropTypes.bool,
        googleErrorMessage: PropTypes.string,
        //actions
        connectFitbit: PropTypes.func,
        loadSteps: PropTypes.func,
        loginGoogle: PropTypes.func,
        logout: PropTypes.func,
        navigation: navigationProp,
    }

    constructor(props) {
        super(props)
    }

    componentWillMount() {

    }

    render() {
        const {
            connectFitbit,
            user,
            loadSteps,
            loginGoogle,
            logout,
            hasGoogle,
            googleErrorMessage,
        } = this.props
        return <SafeAreaView style={styles.container}>

            <View style={{display: 'flex', flexDirection: 'row'}}>
                <Image display-if={user.photoURL} source={{uri: user.photoURL}} style={{width: 100, height: 100}}/>
                <View style={{padding: 20}}>
                    <Text display-if={user.userId}>{user.userId}</Text>
                    <Text display-if={user.email}>{user.email}</Text>
                    <Text display-if={user.firstName || user.lastName}>{`${user.firstName} ${user.lastName}`}</Text>
                    <Text display-if={user.displayName}>{user.displayName}</Text></View>
            </View>

            <View style={{marginBottom: 10}} display-if={!hasGoogle}>
                <Button onPress={() => loginGoogle()} title={'Login With Google'}/>
            </View>
            <Text display-if={googleErrorMessage}>{googleErrorMessage}</Text>

            <View style={{marginBottom: 10}}>
                <Button onPress={() => connectFitbit()} title='Login With Fitbit' display-if={!user.fitbit.isLoggedIn}/>
                <View>
                    <Text display-if={user.isFitbitLoading}>Loading...</Text>
                    <Text display-if={user.fitbit.userId}>Fitbit UserID = {user.fitbit.userId}</Text>
                </View>
            </View>

            <View style={{marginBottom: 10}}>
                <Button onPress={() => loadSteps()} title={'Load steps for last 7 days'}/>
            </View>

            <View style={{marginBottom: 10}}>
                <Button onPress={() => logout()} title={'Log Out'}/>
            </View>
        </SafeAreaView>
    }

}

const mapStateToProps = (state, ownProps) => {
    let user = state.user.toJS()
    let hasGoogle = false
    state.user.get('providerData', Immutable.List()).forEach(provider => {
        console.log('provider', provider)
        switch (provider.providerId) {
            case 'google.com':
                hasGoogle = true
                break
            default:
                break
        }
    })
    return {
        user,
        hasGoogle,
        googleErrorMessage: state.user.getIn(['google', 'error', 'message']),
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        connectFitbit: () => {
            dispatch(loginWithFitbit())
        },
        loadSteps: () => {
            const dayKey = getDateKeyDayAgo(2)
            dispatch(loadAllStepsSince(dayKey))
        },
        loginGoogle: () => {
            dispatch(loginWithGoogle())
        },
        logout: async () => {
            dispatch(await logoutUser())
            ownProps.navigation.navigate(LOGIN_SCREEN)
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)