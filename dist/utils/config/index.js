'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getConfig = getConfig;
exports.setConfig = setConfig;
exports.configAvailable = configAvailable;
exports.setDefaultConfigs = setDefaultConfigs;

var _Config = require('../../models/Config');

var _Config2 = _interopRequireDefault(_Config);

var _default = require('./default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cache = {};

async function getConfig(key, defaultVal = undefined) {
    if (cache[key]) {
        return cache[key];
    }
    try {
        const val = await _Config2.default.findOne().where('key').equals(key);
        cache[key] = val.value;

        return val ? val.value : defaultVal;
    } catch (__) {
        return defaultVal;
    }
}
async function setConfig(key, value) {
    let config = await _Config2.default.findOne().where('key').equals(key);

    if (!config) {
        config = new _Config2.default({ key });
    }

    config.value = value;

    await config.save();

    delete cache[key];
}
async function configAvailable() {
    const count = await _Config2.default.estimatedDocumentCount();
    return count !== 0;
}

async function setDefaultConfigs() {
    for (let key of Object.keys(_default2.default)) {
        await setConfig(key, _default2.default[key]);
    }
}
//# sourceMappingURL=index.js.map