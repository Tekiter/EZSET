import request from 'supertest'

import initApp from '../src/init'

import app from '../src/app.js'

beforeAll(async () => {
    require('dotenv').config()
    const { DATABASE_URI } = process.env
    console.log(DATABASE_URI)
    return await initApp({ PORT: 8088, DATABASE_URI })
})

describe('', () => {
    test('1234', async () => {
        await request(app)
            .get('/')
            .expect(200)
    })
})
