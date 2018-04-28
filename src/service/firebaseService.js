import * as firebase from 'firebase'

const USER_ID = '0aaYr5SVT65p5hLKmsXn'

export async function saveDay({dayKey, steps, scores, weight, imageUri}) {
    console.log('saving day key to firebase', dayKey)
    return firebase.firestore().collection('users').doc(USER_ID).collection('days').doc(dayKey).set({
        dayKey,
        steps,
        scores,
        weight,
        imageUri,
        userId: USER_ID,
    }, {merge: true})
}

export async function fetchDay({dayKey}) {
    console.log('fetch day by dayKey', dayKey)
    let daysRef = firebase.firestore()
        .collection('users')
        .doc(USER_ID)
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

export async function fetchDays({limit}) {
    console.log('starting to fetch days')
    let daysRef = firebase.firestore()
        .collection('users')
        .doc(USER_ID)
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