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
/* eslint-disable no-console */
const database_1 = __importDefault(require("./utils/database"));
const app_1 = __importDefault(require("./app"));
const initialization_1 = __importDefault(require("./utils/initialization"));
const socket_1 = require("./utils/socket");
const elastic_apm_node_1 = __importDefault(require("elastic-apm-node"));
function initElastic(APM_SERVER_URL) {
    if (APM_SERVER_URL === '') {
        console.log('elastic-apm-server is disabled due to empty APM_SERVER_URL.');
        return;
    }
    try {
        elastic_apm_node_1.default.start({
            serviceName: 'ezset',
            serverUrl: APM_SERVER_URL,
            captureBody: 'all',
            usePathAsTransactionName: true,
        });
        console.log('Successfully connected to elastic-apm-server');
    }
    catch (err) {
        throw err;
    }
}
function initDatabase(DATABASE_URI) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!DATABASE_URI) {
            const err = new Error('Environment Variable "DATABASE_URL" has not been set.');
            throw err;
        }
        yield database_1.default.initialize(DATABASE_URI);
        console.log('Successfully connected to database');
    });
}
function initApp({ PORT, DATABASE_URI, SOCKET_PORT, APM_SERVER_URL, }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting EZSET server...');
        try {
            //elastic apm
            initElastic(APM_SERVER_URL);
            initDatabase(DATABASE_URI);
            yield initialization_1.default.initialize();
            yield socket_1.initSocket(app_1.default, SOCKET_PORT);
            app_1.default.listen(PORT, () => console.log(`Listening on port ${PORT}`));
        }
        catch (error) {
            console.log('Failed to initialize');
            console.error(error);
        }
    });
}
exports.default = initApp;
//# sourceMappingURL=init.js.map