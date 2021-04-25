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
exports.setDefaultConfigs = exports.configAvailable = exports.setConfig = exports.getConfig = void 0;
const Config_1 = __importDefault(require("../../models/Config"));
const default_1 = __importDefault(require("./default"));
const cache = {};
function getConfig(key, defaultVal = undefined) {
    return __awaiter(this, void 0, void 0, function* () {
        if (cache[key]) {
            return cache[key];
        }
        try {
            const val = yield Config_1.default.findOne()
                .where('key')
                .equals(key);
            cache[key] = val.value;
            return val ? val.value : defaultVal;
        }
        catch (__) {
            return defaultVal;
        }
    });
}
exports.getConfig = getConfig;
function setConfig(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
        let config = yield Config_1.default.findOne()
            .where('key')
            .equals(key);
        if (!config) {
            config = new Config_1.default({ key });
        }
        config.value = value;
        yield config.save();
        delete cache[key];
    });
}
exports.setConfig = setConfig;
function configAvailable() {
    return __awaiter(this, void 0, void 0, function* () {
        const count = yield Config_1.default.estimatedDocumentCount();
        return count !== 0;
    });
}
exports.configAvailable = configAvailable;
function setDefaultConfigs() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let key of Object.keys(default_1.default)) {
            yield setConfig(key, default_1.default[key]);
        }
    });
}
exports.setDefaultConfigs = setDefaultConfigs;
//# sourceMappingURL=index.js.map