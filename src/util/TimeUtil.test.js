import {
    formatShortDate,
    formatLongDate,
    getDateKey,
    formatDayOfWeekShort,
    getTimeStampFromDayDay
} from './TimeUtil'


describe('format date long', () => {
    test('Sat Jan 6 2018 using timestamp', () => {
        let timestamp = 1515298770562;
        let formatted = formatLongDate(timestamp, true)
        expect(formatted).toBe('Saturday, January 6, 2018')
    })

    test('Sat Jan 6 2018, no year using timestamp', () => {
        let timestamp = 1515298770562;
        let formatted = formatLongDate(timestamp, false)
        expect(formatted).toBe('Saturday, January 6')
    })
})

describe('format date short', () => {
    test('Sat jan 6 2018 using timestamp', () => {
        let timestamp = 1515298770562;
        let formatted = formatShortDate(timestamp)
        expect(formatted).toBe('1/6/18')
    })
})

describe('format day of week short', () => {
    test('Sat jan 6 2018 using timestamp', () => {
        let timestamp = 1515298770562;
        let formatted = formatDayOfWeekShort(timestamp, false)
        expect(formatted).toBe('Sat, Jan 6')
    })
})

describe('format date short', () => {
    test('Sat jan 6 2018 using timestamp', () => {
        let timestamp = 1515298770562;
        let formatted = getDateKey(timestamp)
        expect(formatted).toBe('2018-01-06')
    })

    test('Sat jan 6 2018 using day key', () => {
        let timestamp = 1515298770562;
        let formatted = getDateKey(timestamp)
        let shortDate = formatShortDate(formatted)
        expect(shortDate).toBe('1/6/18')
    })
})

describe('get timestamp from dayKey', () => {
    test('2018-01-19', () => {
        let daykey = '2018-01-19'
        let timestamp = getTimeStampFromDayDay(daykey)
        expect(timestamp).toBe(1516345200000)
    })
})