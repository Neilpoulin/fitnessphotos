import {
    formatShortDate,
    formatLongDate,
    getDateKey,
} from './TimeUtil'


describe('format date long', () => {
    test('Sat Jan 6 2018 using timestamp', () => {
        let timestamp = 1515298770562;
        let formatted = formatLongDate(timestamp, true)
        expect(formatted).toBe('Saturday January 6, 2018')
    })

    test('Sat Jan 6 2018, no year using timestamp', () => {
        let timestamp = 1515298770562;
        let formatted = formatLongDate(timestamp, false)
        expect(formatted).toBe('Saturday January 6')
    })
})

describe('format date short', () => {
    test('Sat jan 6 2018 using timestamp', () => {
        let timestamp = 1515298770562;
        let formatted = formatShortDate(timestamp)
        expect(formatted).toBe('1/6/18')
    })
})

describe('format date short', () => {
    test('Sat jan 6 2018 using timestamp', () => {
        let timestamp = 1515298770562;
        let formatted = getDateKey(timestamp)
        expect(formatted).toBe('2018-01-06')
    })
})

