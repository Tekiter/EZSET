"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_auto_increment_1 = __importDefault(require("mongoose-auto-increment"));
const Schema = mongoose_1.default.Schema;
let commentSchema = new Schema({
    //댓글 구조
    content: { type: String, required: [true, 'comment content required'] },
    writer: { type: String, required: [true, 'comment writer required'] },
    created_date: {
        type: Date,
        default: Date.now,
    },
    isAnonymous: {
        type: Boolean,
        default: false,
    },
});
commentSchema.plugin(mongoose_auto_increment_1.default.plugin, {
    model: 'comment',
    startAt: 1,
});
let Comment = mongoose_1.default.model('comment', commentSchema);
let postSchema = new Schema({
    board: {
        type: Number,
        startAt: 1,
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
    isAnonymous: {
        type: Boolean,
        default: false,
    },
    view: { type: Number, default: 0 },
    like: [{ type: String }],
    isLike: {
        type: Boolean,
        default: false,
    },
    comments: [commentSchema],
    files: [{ type: String }],
});
//좋아요 확인
postSchema.methods.likes_flag = function (liker) {
    for (let i = 0; i < this.like.length; i++) {
        if (this.like[i] == liker) {
            return true;
        }
    }
    return false;
};
//좋아요 카운트
postSchema.virtual('likes_count').get(function () {
    return this.like ? this.like.length : 0;
});
//좋아요 생성
postSchema.methods.likes_create = function (liker) {
    for (let i = 0; i < this.like.length; i++) {
        if (this.like[i] == liker) {
            return;
        }
    }
    this.like.push(liker);
    return this.save();
};
//좋아요 삭제
postSchema.methods.likes_delete = function (liker) {
    for (let i = 0; i < this.like.length; i++) {
        if (this.like[i] == liker) {
            this.like.splice(i, 1);
        }
    }
    return this.save();
};
//댓글 작성
postSchema.methods.addComment = function (content, writer) {
    this.comments.push(new Comment({ content, writer }));
    return this.save();
};
//댓글 수정
postSchema.methods.updateComment = function (content, comment_id) {
    this.comment = this.comments.id(comment_id);
    this.comment.content = content;
    return this.save();
};
//댓글 삭제
postSchema.methods.removeComment = function (comment_id) {
    let comment = this.comments.id(comment_id);
    comment.remove();
    return this.save();
};
//댓글 불러오기
postSchema.methods.getComment = function (comment_id) {
    let comment = this.comments.id(comment_id);
    return comment;
};
postSchema.plugin(mongoose_auto_increment_1.default.plugin, 'post');
module.exports = mongoose_1.default.model('post', postSchema);
//# sourceMappingURL=Post.js.map