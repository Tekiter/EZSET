"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("../../utils/auth"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
    },
    password_hash: {
        type: String,
        required: true,
    },
    info: {
        type: mongoose_1.default.Schema.Types.Mixed,
        default: {},
    },
    roles: {
        type: [String],
    },
    // 출석 대상 유저인지 표시
    attable: {
        type: Boolean,
        default: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});
userSchema
    .virtual('password')
    .get(function () {
    return this.password_hash;
})
    .set(function (value) {
    this.password_hash = auth_1.default.hashPassword(value);
});
userSchema.methods.checkPassword = function (password) {
    return auth_1.default.checkPassword(password, this.password_hash);
};
exports.default = userSchema;
//# sourceMappingURL=UserSchema.js.map