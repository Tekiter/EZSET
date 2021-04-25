"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
const datestatusSchema = new mongoose_1.default.Schema({
    date: {
        type: String,
    },
    state: {
        type: String,
    },
});
const DateStatus = mongoose_1.default.model('dateStatus', datestatusSchema);
var attendanceUserSchema = new Schema({
    name: {
        type: String,
    },
    status: [datestatusSchema],
});
attendanceUserSchema.methods.addStatus = function (date, state) {
    this.status.push(new DateStatus({
        date,
        state,
    }));
    return this.save();
};
module.exports = mongoose_1.default.model('attendanceUser', attendanceUserSchema);
//# sourceMappingURL=attendanceUser.js.map