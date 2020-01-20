import Config from '../models/Config'

const cache = {}

const config = {
    async getConfig(key) {
        if (cache.key) {
            return cache.key
        }
        return (
            await Config.findOne()
                .where('key')
                .equals(key)
        ).value
    },
    async setConfig(key, value) {
        const newconfig = new Config({ key, value })
        await newconfig.save()
        cache.key = value
    },
    async configAvailable() {
        const count = await Config.estimatedDocumentCount()
        return count !== 0
    },
}

module.exports.default = config
module.exports = config
