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
import {loginWithGoogle, loginAsGuest} from 'ducks/user'
import {isAppReady} from 'selector/configSelector'
import {isLoggedIn, isLoggingIn} from 'selector/userSelector'
import {navigationProp} from 'util/PropTypes'
import {FEED_SCREEN} from 'view/nav/Routes'
import {SafeAreaView} from 'react-navigation'
import {textLightColor, textSuccessColor} from 'style/GlobalStyles'
import LoadingIndicator from 'view/organism/LoadingIndicator'


class LoginScreen extends React.Component {
    static propTypes = {
        isReady: PropTypes.bool,
        isLoggedIn: PropTypes.bool,
        isLoggingIn: PropTypes.bool,
        //actions
        loginGoogle: PropTypes.func.isRequired,
        guestLogin: PropTypes.func.isRequired,
        navigation: navigationProp,
    }

    componentWillUpdate(props) {
        if (props.isLoggedIn) {
            props.navigation.navigate(FEED_SCREEN)
        }
    }

    render() {
        const {
            loginGoogle,
            isReady,
            isLoggedIn,
            guestLogin,
            navigation,
            isLoggingIn,
        } = this.props
        return <SafeAreaView style={styles.container}>
            <LoadingIndicator text={'Loading App'} size={'large'} display-if={!isReady}/>
            
            <View style={styles.verticalCenterContainer} display-if={isLoggingIn}>
                <ActivityIndicator size={'small'} color={textSuccessColor}/>
                <Text style={[{fontSize: 15, color: textSuccessColor}, styles.centerText]}>Logging In...</Text>
            </View>
            <View style={styles.verticalCenterContainer} display-if={isReady && !isLoggedIn && !isLoggingIn}>
                <View style={{marginBottom: 10}}>
                    <Button onPress={() => loginGoogle()} title={'Login With Google'}/>
                </View>
                <View style={{marginBottom: 10}}>
                    <Button onPress={() => guestLogin()} title={'Continue as guest'}/>
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
        isLoggingIn: isLoggingIn(state),
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loginGoogle: async () => {
            dispatch(await loginWithGoogle())
        },
        guestLogin: async () => {
            dispatch(await loginAsGuest())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)