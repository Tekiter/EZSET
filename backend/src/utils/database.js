import mongoose from 'mongoose'
import cachegoose from 'cachegoose'
import autoIncrement from 'mongoose-auto-increment'

autoIncrement.initialize(mongoose.connection)
cachegoose(mongoose)

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
        })
    },
}

module.exports.default = database
module.exports = database
