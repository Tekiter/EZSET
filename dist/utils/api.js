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
exports.isPositive = exports.checkRoleTagArray = exports.checkRoleTag = exports.checkUsername = exports.validateParams = exports.unexpectedError = exports.databaseError = exports.asyncRoute = void 0;
/* eslint-disable no-console */
const express_validator_1 = require("express-validator");
const role_1 = __importDefault(require("./role"));
const User_1 = __importDefault(require("../models/User"));
const asyncRoute = fn => (...args) => fn(...args).catch(args[2]);
exports.asyncRoute = asyncRoute;
function databaseError(res, error) {
    const errfunc = err => {
        // console.log(err)
        res.status(500).json({ message: 'database error' });
    };
    if (error) {
        errfunc(error);
    }
    else {
        return errfunc;
    }
}
exports.databaseError = databaseError;
function unexpectedError(res, error) {
    const errfunc = err => {
        console.log(err);
        res.status(500).json({ message: 'unexpected error' });
    };
    if (error) {
        errfunc(error);
    }
    else {
        return errfunc;
    }
}
exports.unexpectedError = unexpectedError;
function validateParams(req, res, next) {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return false;
    }
    else {
        if (next) {
            next();
        }
        return true;
    }
}
exports.validateParams = validateParams;
/**
 * 유저의 아이디가 존재하는지 검사하는 함수
 * @example param('username').custom(checkUsername)
 */
function checkUsername(value) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User_1.default.findOne()
            .where('username')
            .equals(value);
        if (user) {
            return true;
        }
        else {
            throw new Error('존재하지 않는 아이디입니다.');
        }
    });
}
exports.checkUsername = checkUsername;
/**
 * RoleTag 가 존재하는지 검사하는 함수
 * @example param('username').custom(checkRoleTag)
 */
function checkRoleTag(value) {
    return __awaiter(this, void 0, void 0, function* () {
        if (role_1.default.roles.hasRole(value)) {
            return true;
        }
        else {
            throw new Error('존재하지 않는 Role Tag 입니다.');
        }
    });
}
exports.checkRoleTag = checkRoleTag;
/**
 * RoleTag 들의 배열이 올바른지 검사하는 함수
 * @example param('username').custom(checkRoleTag)
 */
function checkRoleTagArray(value) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(value)) {
            throw new Error('올바르지 않은 Role 배열입니다.');
        }
        for (let roletag of value) {
            yield checkRoleTag(roletag);
        }
        return true;
    });
}
exports.checkRoleTagArray = checkRoleTagArray;
/**
 * RoleTag 가 존재하는지 검사하는 함수
 * @example param('username').custom(checkRoleTag)
 */
function isPositive(value) {
    const intval = parseInt(value);
    if (intval) {
        return intval >= 0;
    }
    return false;
}
exports.isPositive = isPositive;
//# sourceMappingURL=api.js.map