'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.asyncRoute = undefined;
exports.databaseError = databaseError;
exports.unexpectedError = unexpectedError;
exports.validateParams = validateParams;
exports.checkUsername = checkUsername;
exports.checkRoleTag = checkRoleTag;
exports.checkRoleTagArray = checkRoleTagArray;
exports.isPositive = isPositive;

var _role = require('./role');

var _role2 = _interopRequireDefault(_role);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
const { validationResult } = require('express-validator');
const asyncRoute = exports.asyncRoute = fn => (...args) => fn(...args).catch(args[2]);

function databaseError(res, error) {
    const errfunc = err => {
        // console.log(err)
        res.status(500).json({ message: 'database error' });
    };

    if (error) {
        errfunc(error);
    } else {
        return errfunc;
    }
}

function unexpectedError(res, error) {
    const errfunc = err => {
        console.log(err);
        res.status(500).json({ message: 'unexpected error' });
    };

    if (error) {
        errfunc(error);
    } else {
        return errfunc;
    }
}

function validateParams(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return false;
    } else {
        if (next) {
            next();
        }
        return true;
    }
}

/**
 * 유저의 아이디가 존재하는지 검사하는 함수
 * @example param('username').custom(checkUsername)
 */
async function checkUsername(value) {
    const user = await _User2.default.findOne().where('username').equals(value);
    if (user) {
        return true;
    } else {
        throw new Error('존재하지 않는 아이디입니다.');
    }
}

/**
 * RoleTag 가 존재하는지 검사하는 함수
 * @example param('username').custom(checkRoleTag)
 */
async function checkRoleTag(value) {
    if (_role2.default.roles.hasRole(value)) {
        return true;
    } else {
        throw new Error('존재하지 않는 Role Tag 입니다.');
    }
}

/**
 * RoleTag 들의 배열이 올바른지 검사하는 함수
 * @example param('username').custom(checkRoleTag)
 */
async function checkRoleTagArray(value) {
    if (!Array.isArray(value)) {
        throw new Error('올바르지 않은 Role 배열입니다.');
    }
    for (let roletag of value) {
        await checkRoleTag(roletag);
    }
    return true;
}

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
//# sourceMappingURL=api.js.map