/* eslint-disable no-console */
import app from './app'
import database from './utils/database'

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
