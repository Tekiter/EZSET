import express from 'express'
import path from 'path'
import logger from 'morgan'
import bodyParser from 'body-parser'
import history from 'connect-history-api-fallback'

import v1API from './api/v1'
import v2API from './api/v2'

const app = express()
app.disable('x-powered-by')

app.use(
    logger('dev', {
        skip: () => app.get('env') === 'test',
    })
)
app.use(bodyParser.json({ limit: '11mb' }))
app.use(
    bodyParser.urlencoded({
        extended: false,
        limit: '10mb',
    })
)
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

app.use(history({}))
app.use(express.static(path.join(__dirname, '../public')))

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// Error handler
app.use((err, req, res, next) => {
    // eslint-disable-line no-unused-vars
    return res.status(err.statusCode || 500).json({
    statusCode: err.statusCode,
    status: 'Error',
    message: err.message,
  });
})

export default app
