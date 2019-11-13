import fs from 'fs'
import path from 'path'
import { Router } from 'express'

import { loginRequired } from '../../utils/auth'

const router = Router()
const indexJs = path.basename(__filename)

fs.readdirSync(__dirname)
    .filter(
        file =>
            file.indexOf('.') !== 0 &&
            file !== indexJs &&
            file.slice(-9) === '.route.js'
    )
    .forEach(routeFile => {
        const subrouter = require(`./${routeFile}`).default
        if (subrouter.loginNotRequired) {
            router.use(`/${routeFile.split('.')[0]}`, subrouter)
        } else {
            router.use(`/${routeFile.split('.')[0]}`, loginRequired, subrouter)
        }
    })

export default router
