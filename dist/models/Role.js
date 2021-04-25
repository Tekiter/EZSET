"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import autoIncrement from 'mongoose-auto-increment'
const roleSchema = new mongoose_1.default.Schema({
    tag: { type: String, trim: true, required: true, unique: true },
    name: { type: String, trim: true, required: true },
    perm: { type: mongoose_1.default.Schema.Types.Mixed, default: {} },
});
// roleSchema.plugin(autoIncrement.plugin, {
//     model: 'role',
//     startAt: 0,
// })
exports.default = mongoose_1.default.model('role', roleSchema);
//# sourceMappingURL=Role.js.map