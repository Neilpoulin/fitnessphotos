//Default timeout = 5 seconds
function Timeout(callable, timeout = 5000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('Function timed out after ' + timeout + 'ms')
        }, timeout)
        callable(resolve, reject)
    })
}

export default Timeout
