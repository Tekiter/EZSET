"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// import nocache from 'nocache'
const express_1 = require("express");
const auth_1 = require("../../utils/auth");
const role_1 = require("../../utils/role");
// const noCacheMiddleware = nocache()
// const noCacheMiddleware = (req, res, next) => {
//     next()
// }
const router = express_1.Router();
const indexJs = path_1.default.basename(__filename);
fs_1.default.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 &&
    file !== indexJs &&
    file.slice(-9) === '.route.js')
    .forEach(routeFile => {
    const subrouter = require(`./${routeFile}`).default;
    const middlewares = [];
    if (!subrouter || !subrouter.use) {
        const err = Error(`Invalid router file '${routeFile}'`);
        throw err;
    }
    // middlewares.push(noCacheMiddleware)
    if (!subrouter.loginNotRequired) {
        middlewares.push(auth_1.loginRequired);
        middlewares.push(role_1.getRoleMiddleware);
    }
    router.use(`/${routeFile.split('.')[0]}`, middlewares, subrouter);
});
exports.default = router;
//# sourceMappingURL=index.js.map