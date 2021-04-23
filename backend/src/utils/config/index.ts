import Config from '../../models/Config'
import defaultConfigs from './default'
import { ConfigEntries } from './entries'

const cache: Partial<ConfigEntries> = {}

export async function getConfig<K extends keyof ConfigEntries>(
    key: K,
    defaultVal: ConfigEntries[K] | undefined = undefined
): Promise<ConfigEntries[K] | undefined> {
    if (key in cache) {
        return cache[key] as ConfigEntries[K]
    }
    try {
        const val = await Config.findOne()
            .where('key')
            .equals(key)

        if (val !== null) {
            return (cache[key] = val.value as ConfigEntries[K])
        } else {
            return defaultVal
        }
    } catch (__) {
        return defaultVal
    }
}
export async function setConfig<K extends keyof ConfigEntries>(
    key: K,
    value: ConfigEntries[K]
): Promise<void> {
    let config = await Config.findOne()
        .where('key')
        .equals(key)

    if (config === null) {
        config = new Config({ key })
    }

    config.value = value

    await config.save()

    delete cache[key]
}
export async function configAvailable(): Promise<boolean> {
    const count = await Config.estimatedDocumentCount()
    return count !== 0
}

export async function setDefaultConfigs(): Promise<void> {
    for (const key in defaultConfigs) {
        await setConfig(key as keyof ConfigEntries, defaultConfigs[key])
    }
}
