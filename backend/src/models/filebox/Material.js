import mongoose from 'mongoose'

const MaterialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: false,
        trim: true,
    },
    //업로드한 파일의 id 저장
    files: [{ type: mongoose.SchemaTypes.ObjectId }],
    //상위 폴더의 id 저장 (부모)
    folder: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
})

export default mongoose.model('Material', MaterialSchema)
