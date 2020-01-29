// /* eslint-disable no-console */
// import database from './utils/database'
// import app from './app'
// import initialization from './utils/initialization'

// const { PORT = 8080 } = process.env

// async function initApp() {
//     try {
//         await database.initialize()
//         console.log('Successfully connected to database')

//         await initialization.initialize()

//         app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
//     } catch (error) {
//         console.log('Failed to initialize')
//         console.error(error)
//     }
// }

// initApp()

// // database
// //     .initialize()
// //     .then(() => {
// //         console.log('Successfully connected to database')
// //         app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
// //     })
// //     .catch(error => {
// //         console.log('Failed to connect database')
// //         console.error(error)
// //     })

import initApp from './init'

const { PORT = 8080, DATABASE_URI, SOCKET_PORT = 5050 } = process.env

initApp({
    PORT,
    DATABASE_URI,
    SOCKET_PORT,
})
