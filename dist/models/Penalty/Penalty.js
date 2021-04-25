"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const penaltySchema = new mongoose_1.default.Schema({
    type_id: {
        type: String,
        index: true,
    },
    type: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
});
exports.default = mongoose_1.default.model('penalty', penaltySchema);
//# sourceMappingURL=Penalty.js.map