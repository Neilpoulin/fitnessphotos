import Expo, {SQLite} from 'expo'
import {
    CREATE_USER_DAY_TABLE,
    CREATE_USER_DAY_TRIGGER
} from 'sql/createTables'

import {
    UPSERT_USER_DAY,
    GET_USER_DAY_SQL,
} from 'sql/userDay'
import {UPDATE_USER_DAY_SQL} from '../sql/userDay'

const DB_NAME = 'db.db'
const db = SQLite.openDatabase(DB_NAME)

export function startDb(dispatch) {
    let createTables = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(CREATE_USER_DAY_TABLE,
                [], (_, resultSet) => {
                    console.log('DB CREATED', resultSet)
                }, (_, error) => {
                    console.error(error)
                })
            tx.executeSql(CREATE_USER_DAY_TRIGGER)
            console.log('finished creating tables')

        }, (error) => {
            //Error
            console.error('failed to execute transactoin', error)
            reject()
        }, () => {
            //Transaction completed
            console.log('transaction completed')
            dispatch({
                type: 'DB_INITIALIZED'
            })
            resolve()
        })
    })

    return Promise.all([createTables])
}

export function deleteAll() {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('delete from user_day;',
                [], (_, resultSet) => {
                    console.log('Deleted all from user_Day', resultSet)
                }, (_, error) => {
                    console.error(error)
                })
        }, (error) => {
            //Error
            console.error('failed to execute transaction', error)
            reject()
        }, () => {
            //Transaction completed
            console.log('transaction completed')
            resolve()
        })
    })
}

export function deleteByRowId(rowId) {
    if (!rowId) {
        console.error(' no row id provided, not deleting anything')
        return Promise.reject('no ro id provided')
    }
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('delete from user_day where rowid = ?;',
                [rowId], (_, resultSet) => {
                    console.log('Found Results', resultSet)
                }, (_, error) => {
                    console.error(error)
                })
        }, (error) => {
            //Error
            console.error('failed to execute transaction', error)
            reject()
        }, () => {
            //Transaction completed
            console.log('transaction completed')
            resolve()
        })
    })
}

export function upsertDay({userId = 1, dayKey, scores = {}, weight, imageUri}) {
    console.log('saving the day', {scores, weight, imageUri, dayKey})
    return new Promise((resolve, reject) => {
        let userDayId = null
        db.transaction(tx => {
            let params = [dayKey, userId, scores.mind, scores.body, scores.food, imageUri, weight]
            console.log('running query with parms', UPSERT_USER_DAY, params)
            tx.executeSql(UPSERT_USER_DAY,
                params,
                (_, resultSet) => {
                    console.log('successfully created row with ', resultSet)
                    resolve({dayId: resultSet.insertId})
                    tx.executeSql('select * from user_day where rowid = ?', [resultSet.insertId], (_, selectResults) => {
                        console.log('inserted results', selectResults)
                    })
                }, (_, error) => {
                    console.error(error)
                    reject(error)
                })
        }, (error) => {
            //Error
            console.error('failed to execute transaction', error)
            reject(error)
        }, () => {
            //Transaction completed
            console.log('transaction completed')
        })
    })
}

export function fetchDayByKey(dayKey, userId = 1) {
    console.log('loading the day ' + dayKey)
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(GET_USER_DAY_SQL,
                [dayKey, userId],
                (_, resultSet) => {
                    console.log('result set = ', resultSet)

                    if (resultSet.rows.length > 0) {
                        let row = resultSet.rows.item(0)
                        console.log('row', row)
                        resolve({
                            dayId: row['rowid'],
                            scores: {
                                mind: row['mind_score'],
                                body: row['body_score'],
                                food: row['food_score']
                            },
                            weight: row['weight_lbs'],
                            imageUri: row['photo_uri'],
                            dayKey,
                        })
                    } else {
                        console.log('fetchDayByKey: no results found')
                        resolve({dayKey})
                    }

                }, (_, error) => {
                    console.error(error)
                    reject(error)
                })
        }, (error) => {
            //Error
            console.error('failed to execute transaction', error)
            reject(error)
        }, () => {
            //Transaction completed
            console.log('transaction completed')
        })
    })
}

export function loadAllDays() {
    db.transaction(tx => {
        tx.executeSql('select rowid, * from user_day;', [], (_, resultSet) => {
            console.log('all results', resultSet)
        })
    })
}