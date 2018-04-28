import Expo from 'expo'

const GOOGLE_CLIENT_ID = '187889743276-otg132n1tm7opeabn28veh85ullq2ltb.apps.googleusercontent.com'

export async function signInWithGoogleAsync() {
    try {
        const result = await Expo.Google.logInAsync({
            iosClientId: GOOGLE_CLIENT_ID,
            scopes: ['profile', 'email'],
        })

        if (result.type === 'success') {
            return result.accessToken
        } else {
            return {cancelled: true}
        }
    } catch (e) {
        return {error: true}
    }
}