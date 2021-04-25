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
exports.getRealname = void 0;
const User_1 = __importDefault(require("../models/User"));
function getRealname(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield User_1.default.findOne()
            .where('username')
            .equals(username)
            .cache(60);
        if (res) {
            return res.info.realname || '';
        }
        else {
            return '';
        }
    });
}
exports.getRealname = getRealname;
//# sourceMappingURL=user.js.map