"use strict";
// /* eslint-disable no-console */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = __importDefault(require("./init"));
const { PORT = '8080', DATABASE_URI = '', SOCKET_PORT = '5050', APM_SERVER_URL = '', } = process.env;
init_1.default({
    PORT,
    DATABASE_URI,
    SOCKET_PORT,
    APM_SERVER_URL,
});
//# sourceMappingURL=index.js.map