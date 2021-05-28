/* eslint-disable no-console */
import * as database from './utils/database'
import app from './app'
import { initialize } from './utils/initialization'
import { initSocket } from './utils/socket'
import elasticApmNode from 'elastic-apm-node'

export interface initConfig {
    PORT: string
    DATABASE_URI: string
    SOCKET_PORT: string
    APM_SERVER_URL: string
}

function initElastic(APM_SERVER_URL: string) {
    if (APM_SERVER_URL === '') {
        console.log(
            'elastic-apm-server is disabled due to empty APM_SERVER_URL.'
        )
        return
    }

    try {
        elasticApmNode.start({
            serviceName: 'ezset',
            serverUrl: APM_SERVER_URL,
            captureBody: 'all',
            usePathAsTransactionName: true,
        })
        console.log('Successfully connected to elastic-apm-server')
    } catch (err) {
        throw err
    }
}

async function initDatabase(DATABASE_URI: string) {
    if (!DATABASE_URI) {
        const err = new Error(
            'Environment Variable "DATABASE_URL" has not been set.'
        )
        throw err
    }
    await database.initialize(DATABASE_URI)
    console.log('Successfully connected to database')
}

export default async function initApp({
    PORT,
    DATABASE_URI,
    SOCKET_PORT,
    APM_SERVER_URL,
}: initConfig): Promise<void> {
    console.log('Starting EZSET server...')
    try {
        //elastic apm
        initElastic(APM_SERVER_URL)

        await initDatabase(DATABASE_URI)

        await initialize()
        await initSocket(app, SOCKET_PORT)

        app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
    } catch (error) {
        console.log('Failed to initialize')
        console.error(error)
    }
}
