class FetchError extends Error {
    constructor(arg) {
        let message
        let status = null
        if (typeof arg === 'string') {
            message = arg
            super(message)
        }
        else {
            message = arg.message
            status = arg.status
            super(arg.message)
        }

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FetchError)
        }
        this.message = message
        this.status = status

    }
}

export default FetchError