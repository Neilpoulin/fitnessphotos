import Expo from 'expo'
import * as firebase from 'firebase'

import {GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID} from 'react-native-dotenv'

async function getGoogleCredential() {
    const googleAuth = await Expo.Google.logInAsync({
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        webClientId: GOOGLE_WEB_CLIENT_ID,
        scopes: ['profile', 'email'],
    })
    const {accessToken, idToken, type, user, refreshToken, serverAuthCode} = googleAuth

    console.log('Successfully logged in with google')
    if (type === 'success') {
        return firebase.auth.GoogleAuthProvider.credential(idToken, accessToken)
    }
    return null
}

export async function signInWithGoogleAsync() {
    try {
        if (firebase.auth().currentUser != null) {
            return linkWithGoogle()
        }
        const credential = await getGoogleCredential()
        console.log('Successfully logged in with google')

        if (credential) {
            // Sign in with credential from the Facebook user.
            const {uid} = await firebase.auth().signInWithCredential(credential)
            return {uid}
        } else {
            return {cancelled: true}
        }
    } catch (e) {
        console.error('something went wrong signing in with google async', e)
        return {error: e}
    }
}

export async function linkWithGoogle() {
    return new Promise(async (resolve, reject) => {
        try {
            const credential = await getGoogleCredential()
            firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential).then(function (usercred) {
                var user = usercred.user
                console.log('Anonymous account successfully upgraded', user)
                resolve(user)
            }, function (error) {
                console.log('Error upgrading anonymous account', error)
                reject(error)
            })
        } catch (e) {
            console.error('something went wrong linking to google', e)
            return e
        }
    })
}

export async function signInAsGuest() {
    try {
        await firebase.auth().signInAnonymously()
    } catch (e) {
        console.error('failed to login anonymously', e)
    }

}