import fs from 'fs'
import path from 'path'
import { Router } from 'express'

const router = Router()
const indexJs = path.basename(__filename)

fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 &&
      file !== indexJs &&
      file.slice(-9) === '.route.js'
  )
  .forEach(routeFile =>
    router.use(`/${routeFile.split('.')[0]}`, require(`./${routeFile}`).default)
  )

export default router
