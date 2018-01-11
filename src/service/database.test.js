import {startDb} from './database';

describe('start db script', () => {
    test('the script starts', () => {
        expect(startDb()).not.toThrow()
    })
})