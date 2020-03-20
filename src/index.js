// /* eslint-disable no-console */

import initApp from './init'

const { PORT = 8080, DATABASE_URI, SOCKET_PORT = 5050 } = process.env

initApp({
    PORT,
    DATABASE_URI,
    SOCKET_PORT,
})
