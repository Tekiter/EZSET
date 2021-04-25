"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema_1 = __importDefault(require("./schema/UserSchema"));
const User_1 = __importDefault(require("./User"));
UserSchema_1.default.methods.accept = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = new User_1.default({
            username: this.username,
            password_hash: this.password_hash,
            info: this.info,
        });
        yield user.save();
    });
};
exports.default = mongoose_1.default.model('PreUser', UserSchema_1.default);
//# sourceMappingURL=PreUser.js.map