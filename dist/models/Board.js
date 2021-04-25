"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_auto_increment_1 = __importDefault(require("mongoose-auto-increment"));
const Schema = mongoose_1.default.Schema;
let boardSchema = new Schema({
    title: String,
    isAnonymous: {
        type: Boolean,
        default: false,
    },
});
boardSchema.plugin(mongoose_auto_increment_1.default.plugin, {
    model: 'board',
    startAt: 1,
});
module.exports = mongoose_1.default.model('board', boardSchema);
//# sourceMappingURL=Board.js.map