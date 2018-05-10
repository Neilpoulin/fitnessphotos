import * as firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

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
import {LOGIN_FIREBASE_SUCCESS} from 'ducks/user'

// const USER_ID = '0aaYr5SVT65p5hLKmsXn'

export function initializeFirebase(dispatch) {


    const firebaseConfig = {
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        databaseURL: FIREBASE_DATABASE_URL,
        storageBucket: FIREBASE_STORAGE_BUCKET,
        projectId: FIREBASE_PROJECT_ID,
    }
    console.log('initializing firebase app')
    firebase.initializeApp(firebaseConfig)
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

    firebase.auth().onAuthStateChanged((user) => {
        if (user != null) {
            console.log('We are authenticated now!', user)
            dispatch({
                type: LOGIN_FIREBASE_SUCCESS,
                user,
            })
        }
        console.log('auth state changed. User = ', user)

        // Do other things
    })

    const db = firebase.firestore()
    db.settings({
        timestampsInSnapshots: true,
    })
    console.log('initilzed firestore db')


}

export async function saveDay({dayKey, steps, scores, weight, imageUri}, userId) {
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

    if (!userId) {
        const savedUser = await firebase.firestore()
            .collection('users')
            .add({googleAuth})
        userId = savedUser.id
        await saveUserId(userId)
        return savedUser
    }
    return await firebase.firestore()
        .collection('users')
        .doc(userId)
        .set({googleAuth}, {merge: true})
}