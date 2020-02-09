import Config from '../models/Config'

const cache = {}

export async function getConfig(key, defaultVal = undefined) {
    if (cache[key]) {
        return cache[key]
    }
    const val = await Config.findOne()
        .where('key')
        .equals(key)

    cache[key] = val.value

    return val ? val.value : defaultVal
}
export async function setConfig(key, value) {
    let config = await Config.findOne()
        .where('key')
        .equals(key)

    if (!config) {
        config = new Config({ key })
    }

    config.value = value

    await config.save()

    delete cache[key]
}
export async function configAvailable() {
    const count = await Config.estimatedDocumentCount()
    return count !== 0
}
