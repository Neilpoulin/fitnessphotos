class FetchError extends Error {
    constructor(arg) {
        let message
        let status = null
        let loginRequired = null
        if (typeof arg === 'string') {
            message = arg
            super(message)
        }
        else {
            message = arg.message
            status = arg.status
            loginRequired = arg.loginRequired
            super(arg.message)
        }

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FetchError)
        }
        this.message = message
        this.status = status
        this.loginRequired = loginRequired

    }
}

export default FetchError