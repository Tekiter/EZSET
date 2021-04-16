import mongoose from 'mongoose'
import cachegoose from 'cachegoose'
import autoIncrement from 'mongoose-auto-increment'

autoIncrement.initialize(mongoose.connection)
cachegoose(mongoose)
mongoose.Promise = global.Promise;

const database = {
    initialize(DATABASE_URI) {
        return new Promise(function(resolve, reject) {
            mongoose.connect(
                DATABASE_URI,
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
