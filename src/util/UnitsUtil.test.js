import {kgToLbs} from './UnitsUtil'

describe('convert kilograms to pounds', () => {
    test('1 kg', () => {
        expect(kgToLbs(1)).toBe('2.2')
    })

    test('155.6 lbs to kg to be 155.6', () => {
        expect(kgToLbs(70.578973)).toBe('155.6')
    })

    test('"1" kg as string', () => {
        expect(kgToLbs('1')).toBe('2.2')
    })
})