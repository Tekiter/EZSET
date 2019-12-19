import request from 'supertest'
import app from '../src/app.js'

describe('', () => {
    test('1234', async () => {
        await request(app).get('/')
    })
})
