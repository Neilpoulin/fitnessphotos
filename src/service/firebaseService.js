import * as firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import {handleAuthStateChange} from 'ducks/user'
import {saveUserId} from 'service/asyncStorageService'
// noinspection ES6CheckImport
import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
} from 'react-native-dotenv'
import uuid from 'uuid'

export function initializeFirebase() {
    return async dispatch => {
        const firebaseConfig = {
            apiKey: FIREBASE_API_KEY,
            authDomain: FIREBASE_AUTH_DOMAIN,
            databaseURL: FIREBASE_DATABASE_URL,
            storageBucket: FIREBASE_STORAGE_BUCKET,
            projectId: FIREBASE_PROJECT_ID,
        }
        console.log('initializing firebase app')
        await firebase.initializeApp(firebaseConfig)

        const db = firebase.firestore()
        db.settings({
            timestampsInSnapshots: true,
        })

        return new Promise(async (resolve) => {
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

            firebase.auth().onAuthStateChanged((user) => {
                user = user ? user.toJSON() : null
                console.log('auth state changed... user = ', user)
                dispatch({type: 'AUTH_STATE_CHANGED', user})
                dispatch(handleAuthStateChange(user))
                resolve()
            })
            console.log('initialized firestore db')
        })
    }

}

export async function saveDay({dayKey, steps, scores, weight, imageSize, localImageUri, cloudImageUri}, userId) {
    console.log('saving day key to firebase', dayKey, 'for userId ', userId)
    return firebase.firestore()
        .collection('users')
        .doc(userId)
        .collection('days')
        .doc(dayKey).set({
            dayKey,
            steps,
            scores,
            weight,
            localImageUri,
            cloudImageUri,
            imageSize,
            userId: userId,
        }, {merge: true})
}

export async function fetchDay({dayKey, userId}) {
    console.log('fetch day by dayKey', dayKey)
    let daysRef = firebase.firestore()
        .collection('users')
        .doc(userId)
        .collection('days')
        .doc(dayKey)
    const day = await daysRef.get()
    if (day.exists) {
        const data = day.data()
        console.log('found the day', data)
        return data
    } else {
        console.log('no such day exists!', dayKey)
        throw new Error('No day found for dayKey' + dayKey)
    }
}

export async function fetchDays({limit, userId}) {
    console.log('starting to fetch days')
    var user = firebase.auth().currentUser

    let daysRef = firebase.firestore()
        .collection('users')
        .doc(userId)
        .collection('days')
        .orderBy('dayKey', 'desc')
    if (limit) {
        console.log('setting limit to ', limit)
        daysRef = daysRef.limit(limit)
    }
    const querySnapshot = await daysRef.get()
    let results = []
    querySnapshot.forEach(doc => {
        const data = doc.data()
        results.push(data)
    })
    return results
}

export async function saveGoogleAuth(googleAuth, userId) {
    console.log('starting to save google auth for userId', userId)

    await saveUserId(userId)
    return await firebase.firestore()
        .collection('users')
        .doc(userId)
        .set({googleAuth}, {merge: true})
}

export async function logoutFirebase() {
    console.log('logging out of firebase')
    try {
        await firebase.auth().signOut()
    } catch (e) {
        console.error('failed to logout of firebase')
    }
}

export function getCurrentUser() {
    return firebase.auth().currentUser
}

export async function saveFitbitAuth(fitbitAuth) {
    console.log('persisting fitbit info to firebase', fitbitAuth)
    try {
        const user = getCurrentUser()
        if (!user) {
            return false
        }

        await firebase.firestore()
            .collection('users')
            .doc(user.uid)
            .set({fitbitAuth}, {merge: true})

        return true
    } catch (e) {
        console.error('failed to persist fitbit auth', e)
        return false
    }
}

export async function fetchUserPreferences() {
    try {
        console.log('fetching user preferences')
        const user = getCurrentUser()
        if (!user) {
            console.log('no user found, no preferences to retrieve')
            return {}
        }
        let query = await firebase.firestore()
            .collection('users')
            .doc(user.uid)

        const querySnapshot = await query.get()

        if (querySnapshot) {
            return querySnapshot.data()
        } else {
            console.log('no results for user when finding preferences')
            return {}
        }
    } catch (e) {
        console.error('failed to get user preferences')
        return {}
    }
}

export async function saveUserPreferences(prefs) {
    console.log('attempting to persist user prefs', prefs)
    try {
        const user = getCurrentUser()
        if (!user) {
            return false
        }

        await firebase.firestore().collection('users')
            .doc(user.uid)
            .set(prefs, {merge: true})

        return true
    } catch (e) {
        console.error('failed to persist user preferences', e)
        return false
    }
}

export async function uploadImage({uri, filename, onProgress}) {
    const response = await fetch(uri)
    const blob = await response.blob()
    const user = getCurrentUser()
    if (!user) {
        return {error: 'you must be logged in to upload images'}
    }

    const name = filename || uuid.v4() + '.jpg'

    const ref = firebase
        .storage()
        .ref()
        .child(`${user.uid}/${name}`)
    try {
        const downloadURL = await ref.getDownloadURL()
        if (downloadURL) {
            console.log('fire already has been uploaded, reusing it', downloadURL)
            return {success: true, downloadURL}
        }

    } catch (e) {
        console.log('no metadata exists, uplaoding file', e)
    }
    let uploadTask = ref.put(blob)
    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if (onProgress) {
            onProgress(progress)
        }
        console.log('state changed during image upload. Progress: ', progress)
    })

    const completedTask = await uploadTask
    return {success: true, downloadURL: completedTask.downloadURL}


}