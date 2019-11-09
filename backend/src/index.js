/* eslint-disable no-console */
import database from './utils/database'
import app from './app'

const { PORT = 8080 } = process.env

database
    .initialize()
    .then(() => {
        console.log('Successfully connected to database')
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
    })
    .catch(error => {
        console.log('Failed to connect database')
        console.error(error)
    })
