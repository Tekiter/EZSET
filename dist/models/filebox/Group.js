"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const GroupSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.SchemaTypes.ObjectId,
    },
    //하위 그룹혹은 폴더의 id 저장
    children: [{ type: mongoose_1.default.SchemaTypes.ObjectId }],
});
exports.default = mongoose_1.default.model('FileboxGroup', GroupSchema);
//# sourceMappingURL=Group.js.map