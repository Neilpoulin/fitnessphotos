import {
    authorizedRequest,
    setAccessTokenForTest
} from './fitbitService'
import FetchError from './FetchError'

describe('authorizedRequestTest', () => {
    test('when fetch fails, an error is thrown', () => {
        let accessToken = 'test-token'
        setAccessTokenForTest(accessToken)
        fetch.mockReject(new Error('test error'))
        return authorizedRequest({uri: 'test.com', method: 'GET'}).then(response => {
            expect(response).toHaveBeenCalledTimes(0)
        }).catch(error => {
            expect(error instanceof FetchError).toBe(true)
            expect(error.message).toMatch(/test error/)
            expect(error.status).toEqual(500)
        })
    })

    test('when fetch succeeds, but with a response error code, an error is thrown', () => {
        let accessToken = 'test-token'
        setAccessTokenForTest(accessToken)
        fetch.mockResponse(JSON.stringify({}), {ok: false, status: 404, statusText: 'not found'})
        return authorizedRequest({uri: 'test.com', method: 'GET'})
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                expect(error instanceof FetchError).toBe(true)
                expect(error.message).toMatch(/not found/)
                expect(error.status).toEqual(404)
            })
    })

    test('when fetch succeeds, the payload is returned', () => {
        let accessToken = 'test-token'
        setAccessTokenForTest(accessToken)
        let body = {name: 'shadow'}
        fetch.mockResponse(JSON.stringify(body))
        return authorizedRequest({uri: 'test.com', method: 'GET'})
            .then(response => {
                console.log(response)
                expect(response).toEqual({name: 'shadow'})
            })
            .catch(error => {
                console.error(error)
            })
    })
})