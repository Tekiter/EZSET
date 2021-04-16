/* eslint-disable no-console */
import database from './utils/database'
import app from './app'
import initialization from './utils/initialization'
import { initSocket } from './utils/socket'

export default async function initApp({ PORT, DATABASE_URI, SOCKET_PORT, APM_SERVER_URL }) {
    try {
        //elastic apm
        try{
        const apm = require('elastic-apm-node').start({
            serviceName: 'ezset_test_apm',
            serverUrl: APM_SERVER_URL,
            captureBody: 'all',
        })
        app.use(apm.middleware.connect())
        global.apm = apm;

        console.log("Successfully connected to elastic-apm-server")
        }catch(err){
            throw err
        }

        if (!DATABASE_URI) {
            const err = new Error(
                'Environment Variable "DATABASE_URL" has not been set.'
            )
            throw err
        }
        await database.initialize(DATABASE_URI)
        console.log('Successfully connected to database')

        await initialization.initialize()
        await initSocket(app, SOCKET_PORT)

        app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
    } catch (error) {
        console.log('Failed to initialize')
        console.error(error)
    }
}
