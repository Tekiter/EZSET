import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
const Schema = mongoose.Schema

let commentSchema = new Schema({
    //댓글 구조
    content: { type: String, required: [true, 'comment content required'] },
    writer: { type: String, required: [true, 'comment writer required'] },
})

commentSchema.plugin(autoIncrement.plugin, {
    model: 'comment',
    startAt: 1,
})
let Comment = mongoose.model('comment', commentSchema)

let postSchema = new Schema({
    board: {
        type: Number,
        ref: 'board',
    },
    title: {
        type: String,
        required: [true, 'post title required'],
    },
    content: {
        type: String,
        required: [true, 'post title required'],
    },
    author: {
        type: String,
        required: [true, 'post writer required'],
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
    view: { type: Number, default: 0 },
    like: [{ liker: { type: String } }],
    comments: [commentSchema],
})

//좋아요 카운트
postSchema.virtual('likes_count').get(function() {
    return this.likes ? this.likes.length : 0
})

//댓글 갯수 카운트
postSchema.virtual('comments_count').get(function() {
    return this.comments ? this.comments.length : 0
})

//댓글 작성
postSchema.methods.addComment = function(content, writer) {
    this.comments.push(new Comment({ content, writer }))
    return this.save()
}

//댓글 삭제
postSchema.methods.removeComment = function(comment_id) {
    let comment = this.comments.id(comment_id)
    comment.remove()
    return this.save()
}

postSchema.plugin(autoIncrement.plugin, 'post')
module.exports = mongoose.model('post', postSchema)
