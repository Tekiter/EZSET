/* eslint-disable no-console */
const { validationResult } = require('express-validator')

export const asyncRoute = fn => (...args) => fn(...args).catch(args[2])

export function databaseError(res, error) {
    const errfunc = err => {
        // console.log(err)
        res.status(500).json({ message: 'database error' })
    }

    if (error) {
        errfunc(error)
    } else {
        return errfunc
    }
}

export function unexpectedError(res, error) {
    const errfunc = err => {
        console.log(err)
        res.status(500).json({ message: 'unexpected error' })
    }

    if (error) {
        errfunc(error)
    } else {
        return errfunc
    }
}

export function validateParams(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return false
    } else {
        if (next) {
            next()
        }
        return true
    }
}
