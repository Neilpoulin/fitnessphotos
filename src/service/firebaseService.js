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
                console.log('auth state changed... user = ', user)
                dispatch({type: 'AUTH_STATE_CHANGED', user})
                dispatch(handleAuthStateChange(user))
                resolve()
            })
            console.log('initilzed firestore db')
        })
    }

}

export async function saveDay({dayKey, steps, scores, weight, imageUri, imageSize}, userId) {
    console.log('saving day key to firebase', dayKey, 'for userid ', userId)
    return firebase.firestore()
        .collection('users')
        .doc(userId)
        .collection('days')
        .doc(dayKey).set({
            dayKey,
            steps,
            scores,
            weight,
            imageUri,
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

export async function uploadImage({uri}) {
    const response = await fetch(uri)
    const blob = await response.blob()
    const user = getCurrentUser()
    if (!user) {
        return {error: 'you must be logged in to upload images'}
    }

    const ref = firebase
        .storage()
        .ref()
        .child(`${user.uid}/${uuid.v4()}`)

    const snapshot = await ref.put(blob)
    return {success: true, downloadURL: snapshot.downloadURL}
}