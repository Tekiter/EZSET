import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import logger from 'morgan'
import bodyParser from 'body-parser'
import history from 'connect-history-api-fallback'

import v1API from './api/v1'
import v2API from './api/v2'

// 레거시 코드 호환성을 위해 Error.status 프로퍼티 타입 추가
declare global {
    interface Error {
        status: number
    }
}

interface MiddlewareSetter {
    (app: express.Express): void
}

function setupMiddlewares(
    app: express.Express,
    middlewares: MiddlewareSetter[]
) {
    middlewares.forEach(setup => setup(app))
}

function setupSecurity(app: express.Express) {
    app.disable('x-powered-by')
}

function setupLogger(app: express.Express) {
    app.use(
        logger('dev', {
            skip: () => app.get('env') === 'test',
        })
    )
}

function setupParsers(app: express.Express) {
    app.use(bodyParser.json({ limit: '11mb' }))
    app.use(
        bodyParser.urlencoded({
            extended: false,
            limit: '10mb',
        })
    )
}
function setupAPI(app: express.Express) {
    app.use('/api/v1', v1API)
    app.use('/api/v2', v2API)

    app.use('/api/v1/*', (req, res, next) => {
        const err = new Error('올바르지 않은 API 접근입니다.')
        err.status = 404
        next(err)
    })
    app.use('/api/v2/*', (req, res, next) => {
        const err = new Error('올바르지 않은 API 접근입니다.')
        err.status = 404
        next(err)
    })
}

function setupSPA(app: express.Express) {
    app.use(history({}))
    app.use(express.static(path.join(__dirname, '../public')))
}

function setupErrorHandler(app: express.Express) {
    // Catch 404 and forward to error handler
    app.use((_req, _res, next) => {
        const err = new Error('Not Found')
        err.status = 404
        next(err)
    })

    // Error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        if (
            !err.statusCode &&
            (process.env.NODE_ENV + '').toLowerCase() !== 'production'
        ) {
            console.error(err)
        }
        // eslint-disable-line no-unused-vars
        return res.status(err.statusCode || 500).json({
            statusCode: err.statusCode,
            status: 'Error',
            message: err.message,
        })
    })
}

const app = express()

setupMiddlewares(app, [
    setupSecurity,
    setupLogger,
    setupParsers,
    setupAPI,
    setupSPA,
    setupErrorHandler,
])

export default app
