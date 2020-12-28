let interceptors = []

if (!global.fetch) {
    try {
        // eslint-disable-next-line global-require
        global.fetch = require('node-fetch')
    } catch (err) {
        throw Error('No fetch available. Unable to register fetch-intercept')
    }
}
global.fetch = (function (fetch) {
    return (...args) => interceptor(fetch, ...args)
}(global.fetch))

const interceptor = (fetch, ...args) => {
    const reversedInterceptors = interceptors.reduce((array, _interceptor) => [_interceptor].concat(array), [])
    let promise = Promise.resolve(args)

    // Register request interceptors
    reversedInterceptors.forEach(({ request, requestError }) => {
        if (request || requestError) {
            promise = promise.then(_args => request(..._args), requestError)
        }
    })

    // Register fetch call
    promise = promise.then(_args => fetch(..._args))

    // Register response interceptors
    reversedInterceptors.forEach(({ response, responseError }) => {
        if (response || responseError) {
            promise = promise.then(response, responseError)
        }
    })

    return promise
}

const register = (_interceptor) => {
    interceptors.push(_interceptor)
    return () => {
        const index = interceptors.indexOf(_interceptor)
        if (index >= 0) {
            interceptors.splice(index, 1)
        }
    }
}

const clear = () => {
    interceptors = []
}

export {
    register,
    clear,
}
