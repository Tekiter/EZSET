import mongoose from 'mongoose'
import cachegoose from 'cachegoose'
import autoIncrement from 'mongoose-auto-increment'

autoIncrement.initialize(mongoose.connection)
cachegoose(mongoose)

export function initialize(DATABASE_URI: string): Promise<void> {
    return new Promise(function(resolve, reject) {
        mongoose.connect(
            DATABASE_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            function(err) {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            }
        )
    })
}
