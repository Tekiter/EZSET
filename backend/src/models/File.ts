import mongoose from 'mongoose'

export interface FileDocument extends mongoose.Document {
    filename: string
    size: number
    uploader: string
    mimetype: string
    hit: number
    timestamp: Date
    link?: { target: string; ref: string }
    increaseHit(): Promise<FileDocument>
}

const fileSchema = new mongoose.Schema({
    // 유저가 지정한 파일 이름
    filename: {
        type: String,
        required: true,
        trim: true,
    },

    // 파일의 크기
    size: {
        type: Number,
    },

    // 파일을 업로드 한 사람
    uploader: {
        type: String,
    },

    // 파일의 mime 타입
    mimetype: {
        type: String,
    },

    // 파일을 다운로드한 횟수
    hit: {
        type: Number,
        default: 0,
    },

    // 파일을 업로드한 시간
    timestamp: {
        type: Date,
        default: Date.now,
    },

    link: {
        target: {
            type: String,
        },
        ref: {
            type: String,
        },
    },
})

fileSchema.methods.increaseHit = function(this: FileDocument) {
    this.hit += 1
    return this.save()
}

fileSchema.methods.hasLink = function(this: FileDocument) {
    if (this.link) {
        if (this.link.target) {
            return true
        }
    }
    return false
}

export default mongoose.model<FileDocument>('File', fileSchema)
