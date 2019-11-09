/* eslint-disable no-console */
export function databaseError(res, error) {
    const errfunc = err => {
        console.log(err)
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
