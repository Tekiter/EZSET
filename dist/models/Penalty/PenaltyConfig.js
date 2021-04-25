"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const penaltyConfigSchema = new mongoose_1.default.Schema({
    key: {
        type: String,
        unique: true,
        trim: true,
        index: true,
    },
    value: {
        type: Number,
    },
});
exports.default = mongoose_1.default.model('penaltyConfig', penaltyConfigSchema);
//# sourceMappingURL=PenaltyConfig.js.map