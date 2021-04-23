import mongoose from 'mongoose'

export interface ConfigDocument extends mongoose.Document {
    key: string
    value: unknown
}

const configSchema = new mongoose.Schema({
    key: {
        type: String,
        unique: true,
        trim: true,
        index: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
    },
})

export default mongoose.model<ConfigDocument>('config', configSchema)
