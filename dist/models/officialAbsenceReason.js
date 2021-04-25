"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var officialAbsenceSchema = new Schema({
    name: {
        type: String,
    },
    day: {
        type: Date,
    },
    reason: {
        type: String,
    },
    approval: {
        type: Boolean,
    },
});
module.exports = mongoose_1.default.model('officialabsencereason', officialAbsenceSchema);
//# sourceMappingURL=officialAbsenceReason.js.map