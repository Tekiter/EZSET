import mongoose from 'mongoose'

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    //폴더면 true 그룹이면 false
    isfolder: {
        type: Boolean,
        required: true,
    },
    //상위 그룹의 id 저장
    parent: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    //하위 그룹혹은 폴더의 id 저장
    children: [{ type: mongoose.SchemaTypes.ObjectId }],
})

export default mongoose.model('Group', GroupSchema)
