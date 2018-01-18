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
        return authorizedRequest({url: 'test.com', method: 'GET'}).then(response => {
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
        return authorizedRequest({url: 'test.com', method: 'GET'})
            .then(response => {
                console.log(response)
                expect(response).toHaveBeenCalledTimes(0)
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
        return authorizedRequest({url: 'test.com', method: 'GET'})
            .then(response => {
                console.log(response)
                expect(response).toEqual({name: 'shadow'})
            })
            .catch(error => {
                console.error(error)
            })
    })

    test('when no URL is provided, an error is thrown', () => {
        let accessToken = 'test-token'
        setAccessTokenForTest(accessToken)
        let body = {name: 'shadow'}
        fetch.mockResponse(JSON.stringify(body))
        return authorizedRequest({method: 'GET'})
            .then((response) => {
                expect(response).toBeNull()
            })
            .catch(error => {
                console.log(error)
                expect(error instanceof FetchError).toBe(true)
                expect(error.message).toMatch(/No URL provided/)
                expect(error.status).toEqual(400)
            })
    })

    test('ensure the fetch was called with the header and bearer token', () => {
        let accessToken = 'test-token'
        setAccessTokenForTest(accessToken)
        let body = {name: 'shadow'}
        fetch.mockResponse(JSON.stringify(body))


        return authorizedRequest({url: 'test.com', method: 'GET'})
            .then(response => {
                expect(fetch).toHaveBeenCalledWith('test.com', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
            })
    })

    test('when no auth token is found, an error is thrown', () => {
        setAccessTokenForTest(null)
        fetch.mockReject(new Error('test error'))
        return authorizedRequest({url: 'test.com', method: 'GET'}).then(response => {
            expect(response).toHaveBeenCalledTimes(0)
        }).catch(error => {
            expect(error instanceof FetchError).toBe(true)
            expect(error.message).toMatch(/no token/)
            expect(error.status).toEqual(401)
            expect(error.loginRequired).toBeTruthy()
        })
    })

})