"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MaterialSchema = new mongoose_1.default.Schema({
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
    created_date: {
        type: Date,
        default: Date.now,
    },
    //업로드한 파일의 id 저장
    files: [{ type: mongoose_1.default.SchemaTypes.ObjectId }],
    //상위 폴더의 id 저장 (부모)
    parent: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        required: true,
    },
});
exports.default = mongoose_1.default.model('FileboxMaterial', MaterialSchema);
//# sourceMappingURL=Material.js.map