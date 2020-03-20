'use strict';

var _config = require('../utils/config');

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _PenaltyConfig = require('../models/Penalty/PenaltyConfig');

var _PenaltyConfig2 = _interopRequireDefault(_PenaltyConfig);

var _role = require('../utils/role');

var _role2 = _interopRequireDefault(_role);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const initialization = {
    async createSuperAdmin() {
        const exists = _User2.default.findOne().where('username').equals('admin');
        if (exists) {
            console.log('Removing existing admin account...'); // eslint-disable-line no-console
            await exists.remove();
        }

        const admin = new _User2.default({
            username: 'admin',
            password: 'admin',
            info: {
                realname: '관리자'
            },
            roles: ['admin']
        });
        const result = await admin.save();
        await (0, _config.setConfig)('superAdmin', result.username);

        console.log(`Superadmin created (admin/admin)`); // eslint-disable-line no-console
    },
    async createDefaultPenalty() {
        console.log('Creating defalut penalty items...'); // eslint-disable-line no-console
        const existLateConfig = await _PenaltyConfig2.default.findOne().where('key').equals('지각').count();
        if (existLateConfig == 0) {
            const Late = new _PenaltyConfig2.default({
                key: '지각',
                value: -1
            });
            await Late.save();
        }
        const existAbsenceConfig = await _PenaltyConfig2.default.findOne().where('key').equals('결석').count();
        if (existAbsenceConfig == 0) {
            const Absence = new _PenaltyConfig2.default({
                key: '결석',
                value: -1
            });
            await Absence.save();
        }
    },
    async initialize() {
        const isFirstStart = !(await (0, _config.configAvailable)());
        if (isFirstStart) {
            console.log('Initialization detected.'); // eslint-disable-line no-console
            await initialization.createSuperAdmin();

            await (0, _config.setDefaultConfigs)();
        }
        await initialization.createDefaultPenalty();
        await _role2.default.loadRoles();
    }
};

module.exports.default = initialization;
module.exports = initialization;
//# sourceMappingURL=initialization.js.map