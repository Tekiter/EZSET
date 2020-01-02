/* eslint-disable no-console */
import database from './utils/database'
import app from './app'
import initialization from './utils/initialization'

export default async function initApp({ PORT, DATABASE_URI }) {
    try {
        await database.initialize(DATABASE_URI)
        console.log('Successfully connected to database')

        await initialization.initialize()

        app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
    } catch (error) {
        console.log('Failed to initialize')
        console.error(error)
    }
}
