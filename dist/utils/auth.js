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
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../utils/config");
const auth = {
    hashPassword(password) {
        return bcrypt_nodejs_1.default.hashSync(password);
    },
    checkPassword(password, hash) {
        return bcrypt_nodejs_1.default.compareSync(password, hash);
    },
    createAccessToken({ username, roles }) {
        return new Promise(function (resolve, reject) {
            jsonwebtoken_1.default.sign({
                username,
                roles,
            }, process.env.JWT_SECRET, { expiresIn: 86400 }, function (err, encoded) {
                if (!err) {
                    resolve(encoded);
                }
                else {
                    reject(err);
                }
            });
        });
    },
    //accessToken이 유효한지 확인
    checkToken(token) {
        return new Promise(function (resolve, reject) {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, function (err, decoded) {
                if (!err) {
                    resolve(decoded);
                }
                else {
                    reject(err);
                }
            });
        });
    },
    //민감한 개인정보를 수정,관리하기 위한 토큰
    createEditToken(username) {
        return new Promise(function (resolve, reject) {
            jsonwebtoken_1.default.sign({
                username,
                is_edit_token: true,
            }, process.env.JWT_SECRET, { expiresIn: 300 }, function (err, encoded) {
                if (!err) {
                    resolve(encoded);
                }
                else {
                    reject(err);
                }
            });
        });
    },
    loginRequired(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.headers && req.headers.authorization) {
                let tokenbase = req.headers.authorization.split(' ');
                if (tokenbase[0] === 'Bearer') {
                    try {
                        const user = yield auth.checkToken(tokenbase[1]);
                        req.user = user;
                        next();
                        return;
                    }
                    catch (error) {
                        res.status(401).json({ message: '로그인이 필요합니다.' });
                        return;
                    }
                }
            }
            res.status(401).json({ message: '로그인이 필요합니다.' });
        });
    },
    superAdminRequired(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const f = () => __awaiter(this, void 0, void 0, function* () {
                if (req.user.username === (yield config_1.getConfig('superAdmin'))) {
                    next();
                }
                else {
                    res.status(403).json({ message: '권한이 부족합니다.' });
                }
            });
            if (req.user) {
                yield f();
            }
            else {
                auth.loginRequired(req, res, f);
            }
        });
    },
};
module.exports.default = auth;
module.exports = auth;
//# sourceMappingURL=auth.js.map