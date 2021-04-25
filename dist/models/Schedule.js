"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var ScheduleSchema = new Schema({
    start: {
        type: Date,
    },
    end: {
        type: Date,
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    color: {
        type: String,
    },
});
module.exports = mongoose_1.default.model('schedule', ScheduleSchema);
//# sourceMappingURL=Schedule.js.map