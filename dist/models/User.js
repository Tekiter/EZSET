"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_auto_increment_1 = __importDefault(require("mongoose-auto-increment"));
const UserSchema_1 = __importDefault(require("./schema/UserSchema"));
UserSchema_1.default.plugin(mongoose_auto_increment_1.default.plugin, {
    model: 'User',
    field: 'seq',
});
exports.default = mongoose_1.default.model('User', UserSchema_1.default);
//# sourceMappingURL=User.js.map