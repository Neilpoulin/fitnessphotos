import Timeout from './Timeout'

test('Function that does not resolve after timeout period', () => {
    let executionDuration = 1500
    let timeoutMax = 1000
    let p = (resolve, reject) => {
        setTimeout(() => {
            resolve('Function Finished!')
        }, executionDuration)
    }
    return Timeout(p, timeoutMax).then(response => {

    }).catch(error => expect(error).toBe('Function timed out after ' + timeoutMax + 'ms'))
})

test('Function that  resolves before timeout period', () => {
    let executionDuration = 500
    let timeoutMax = 1000
    let message = 'Function finished!'
    let p = (resolve, reject) => {
        setTimeout(() => {
            resolve(message)
        }, executionDuration)
    }
    return Timeout(p, timeoutMax).then(response => {
        expect(response).toBe(message)
    })
})