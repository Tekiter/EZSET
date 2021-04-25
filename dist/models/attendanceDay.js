"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
const statusSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    state: {
        type: String,
    },
});
const Status = mongoose_1.default.model('status', statusSchema);
var attendanceDaySchema = new Schema({
    day: {
        type: String,
        unique: true,
    },
    status: [statusSchema],
});
attendanceDaySchema.methods.addStatus = function (name, state) {
    this.status.push(new Status({
        name,
        state,
    }));
    return this.save();
};
module.exports = mongoose_1.default.model('attendanceDay', attendanceDaySchema);
//# sourceMappingURL=attendanceDay.js.map