"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const configSchema = new mongoose_1.default.Schema({
    key: {
        type: String,
        unique: true,
        trim: true,
        index: true,
    },
    value: {
        type: mongoose_1.default.Schema.Types.Mixed,
    },
});
exports.default = mongoose_1.default.model('config', configSchema);
//# sourceMappingURL=Config.js.map