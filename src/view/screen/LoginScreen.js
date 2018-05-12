import React from 'react'
import {
    View,
    Text,
    ActivityIndicator,
} from 'react-native'
import {Button} from 'react-native-elements'

import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import styles from './LoginScreenStyles'
import {loginWithGoogle} from 'ducks/user'
import {isAppReady} from 'selector/configSelector'
import {isLoggedIn} from 'selector/userSelector'
import {navigationProp} from 'util/PropTypes'
import {FEED_SCREEN} from 'view/nav/Routes'
import {SafeAreaView} from 'react-navigation'


class LoginScreen extends React.Component {
    static propTypes = {
        isReady: PropTypes.bool,
        isLoggedIn: PropTypes.bool,
        //actions
        loginGoogle: PropTypes.func.isRequired,
        navigation: navigationProp,
    }


    render() {
        const {
            loginGoogle,
            isReady,
            isLoggedIn,
            navigation,
        } = this.props
        return <SafeAreaView style={styles.container}>
            <View display-if={!isReady} style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size={'large'} color={'#00009A'}/>
                <Text style={[{fontSize: 20, color: '#00009A'}, styles.centerText]}>Loading App</Text>
            </View>

            <View style={styles.verticalCenterContainer} display-if={isReady && !isLoggedIn}>
                <View style={{marginBottom: 10}}>
                    <Button onPress={() => loginGoogle()} title={'Login With Google'}/>
                </View>
            </View>
            <View display-if={isLoggedIn} style={styles.verticalCenterContainer}>
                <Text style={styles.centerText}>You are logged in</Text>
                <Button onPress={() => navigation.navigate(FEED_SCREEN)} title={'Continue To Feed'}/>
            </View>
        </SafeAreaView>
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        isReady: isAppReady(state),
        isLoggedIn: isLoggedIn(state),
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loginGoogle: () => {
            dispatch(loginWithGoogle())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)