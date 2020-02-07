import Config from '../models/Config'

const cache = {}

export async function getConfig(key, defaultVal = undefined) {
    if (cache.key) {
        return cache.key
    }
    const val = await Config.findOne()
        .where('key')
        .equals(key)
    return val ? val.value : defaultVal
}
export async function setConfig(key, value) {
    const newconfig = new Config({ key, value })
    await newconfig.save()
    cache.key = value
}
export async function configAvailable() {
    const count = await Config.estimatedDocumentCount()
    return count !== 0
}
