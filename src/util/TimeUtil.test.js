import {
    formatShortDate,
    formatLongDate,
    getDayKey,
    formatDayOfWeekShort,
    getTimeStampFromDayKey,
    isBeforeNow,
    addDuration,

} from './TimeUtil'
import moment from 'moment'

describe('format date long', () => {
    test('Sat Jan 6 2018 using timestamp', () => {
        let timestamp = 1515298770562
        let formatted = formatLongDate(timestamp, true)
        expect(formatted).toBe('Saturday, January 6, 2018')
    })

    test('Sat Jan 6 2018, no year using timestamp', () => {
        let timestamp = 1515298770562
        let formatted = formatLongDate(timestamp, false)
        expect(formatted).toBe('Saturday, January 6')
    })
})

describe('format date short', () => {
    test('Sat jan 6 2018 using timestamp', () => {
        let timestamp = 1515298770562
        let formatted = formatShortDate(timestamp)
        expect(formatted).toBe('1/6/18')
    })
})

describe('format day of week short', () => {
    test('Sat jan 6 2018 using timestamp', () => {
        let timestamp = 1515298770562
        let formatted = formatDayOfWeekShort(timestamp, false)
        expect(formatted).toBe('Sat, Jan 6')
    })
})

describe('get date key', () => {
    test('Sat jan 6 2018 using timestamp', () => {
        let timestamp = 1515298770562
        let formatted = getDayKey(timestamp)
        expect(formatted).toBe('2018-01-06')
    })

    test('Sat jan 6 2018 using day key', () => {
        let timestamp = 1515298770562
        let formatted = getDayKey(timestamp)
        let shortDate = formatShortDate(formatted)
        expect(shortDate).toBe('1/6/18')
    })
})

describe('get timestamp from dayKey', () => {
    test('2018-01-19', () => {
        let daykey = '2018-01-19'
        let timestamp = getTimeStampFromDayKey(daykey)
        expect(timestamp).toBe(1516345200000)
    })
})

describe('isBeforeNow', () => {
    test('pass in date string that is old', () => {
        let start = '1970-01-01'
        expect(isBeforeNow(start)).toEqual(true)
    })

    test('pass in date that is old', () => {
        let start = moment('1970-01-01').toDate()
        expect(isBeforeNow(start)).toEqual(true)
    })

    test('pass in ms that is old', () => {
        let start = moment('1970-01-01').toDate().getTime()
        expect(isBeforeNow(start)).toEqual(true)
    })

    test('pass in ms that in the future old', () => {
        let start = '2099-01-01'
        expect(isBeforeNow(start)).toEqual(false)
    })

    test('pass in a past date but adding 1 year', () => {
        let start = moment('2019-01-01')
        expect(isBeforeNow(start, 10, 'years')).toEqual(false)
    })

    test('pass in a past date but adding 1 day', () => {
        let start = moment('2018-01-01')
        expect(isBeforeNow(start, 1, 'day')).toEqual(true)
    })
})

describe('add duration', () => {
    test('no start time, no add, no period', () => {
        let future = addDuration({})
        expect(future).toBeTruthy()
        expect(future instanceof Date).toBeTruthy()
    })

    test('start tme is now, no add, no period', () => {
        let start = new Date()
        let future = addDuration({start})
        expect(future).toEqual(start)
    })

    test('start tme is now, add 100, no period', () => {
        let start = new Date()
        let startMs = start.getTime()
        let future = addDuration({start, amount: 100})
        expect(future.getTime()).toEqual(startMs + 100)
    })

    test('start tme is now, add 100, period seconds', () => {
        let start = new Date()
        let startMs = start.getTime()
        let future = addDuration({start, amount: 100, period: 's'})
        expect(future.getTime()).toEqual(startMs + (100 * 1000))
    })
})