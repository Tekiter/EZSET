import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

const database = {
    initialize() {
        return new Promise(function(resolve, reject) {
            mongoose.connect(
                process.env.DATABASE_URI,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                },
                function(err, db) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
            autoIncrement.initialize(mongoose.connection)
        })
    },
}

export default database
