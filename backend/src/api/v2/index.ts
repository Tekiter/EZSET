/* eslint-disable @typescript-eslint/no-var-requires */

import fs from 'fs'
import path from 'path'
import { Router } from 'express'
import { loginRequired } from '../../utils/auth'
import role from '../../utils/role'
import { Middleware } from 'src/types'

const router = Router()
const indexJs = path.basename(__filename)

fs.readdirSync(__dirname)
    .filter(
        file =>
            file.indexOf('.') !== 0 &&
            file !== indexJs &&
            (file.slice(-9) === '.route.ts' || file.slice(-9) === '.route.js')
    )
    .forEach(routeFile => {
        const subrouter = require(`./${routeFile}`).default
        const middlewares: Middleware[] = []

        if (!subrouter || !subrouter.use) {
            const err = Error(`Invalid router file '${routeFile}'`)
            throw err
        }

        if (!subrouter.loginNotRequired) {
            middlewares.push(loginRequired)
            middlewares.push(role.getRoleMiddleware)
        }

        router.use(`/${routeFile.split('.')[0]}`, middlewares as [], subrouter)
    })

export default router
