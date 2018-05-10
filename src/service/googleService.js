import Expo from 'expo'
import {saveGoogleAuth as saveGoogleAuthLocal, fetchGoogleAuth, fetchUserId} from 'service/asyncStorageService'
import {saveGoogleAuth as saveGoogleAuthDb} from 'service/firebaseService'
import * as firebase from 'firebase'

import {GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID} from 'react-native-dotenv'

export async function signInWithGoogleAsync() {
    try {
        const googleAuth = await Expo.Google.logInAsync({
            iosClientId: GOOGLE_IOS_CLIENT_ID,
            webClientId: GOOGLE_WEB_CLIENT_ID,
            scopes: ['profile', 'email'],
        })
        const {accessToken, idToken, type, user, refreshToken, serverAuthCode} = googleAuth

        console.log('Successfully logged in with google')
        if (type === 'success') {
            const userId = await fetchUserId()
            const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken)
            console.log('credential', credential)
            // Sign in with credential from the Facebook user.
            const {uid} = await firebase.auth().signInWithCredential(credential)
            saveGoogleAuthLocal({accessToken, idToken, user, refreshToken, serverAuthCode, uid})
            saveGoogleAuthDb({accessToken, idToken, user, refreshToken, serverAuthCode, uid}, userId)

            return {accessToken, idToken, user, refreshToken, serverAuthCode, uid}
        } else {
            return {cancelled: true}
        }
    } catch (e) {
        console.error('something went wrong sigining in with google async', e)
        return {error: e}
    }
}