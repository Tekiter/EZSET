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
const config_1 = require("../utils/config");
const User_1 = __importDefault(require("../models/User"));
const PenaltyConfig_1 = __importDefault(require("../models/Penalty/PenaltyConfig"));
const role_1 = __importDefault(require("../utils/role"));
const initialization = {
    createSuperAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = User_1.default.findOne()
                .where('username')
                .equals('admin');
            if (exists) {
                console.log('Removing existing admin account...'); // eslint-disable-line no-console
                yield exists.remove();
            }
            const admin = new User_1.default({
                username: 'admin',
                password: 'admin',
                info: {
                    realname: '관리자',
                },
                roles: ['admin'],
            });
            const result = yield admin.save();
            yield config_1.setConfig('superAdmin', result.username);
            console.log(`Superadmin created (admin/admin)`); // eslint-disable-line no-console
        });
    },
    createDefaultPenalty() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating defalut penalty items...'); // eslint-disable-line no-console
            const existLateConfig = yield PenaltyConfig_1.default.findOne()
                .where('key')
                .equals('지각')
                .count();
            if (existLateConfig == 0) {
                const Late = new PenaltyConfig_1.default({
                    key: '지각',
                    value: -1,
                });
                yield Late.save();
            }
            const existAbsenceConfig = yield PenaltyConfig_1.default.findOne()
                .where('key')
                .equals('결석')
                .count();
            if (existAbsenceConfig == 0) {
                const Absence = new PenaltyConfig_1.default({
                    key: '결석',
                    value: -1,
                });
                yield Absence.save();
            }
        });
    },
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const isFirstStart = !(yield config_1.configAvailable());
            if (isFirstStart) {
                console.log('Initialization detected.'); // eslint-disable-line no-console
                yield initialization.createSuperAdmin();
                yield config_1.setDefaultConfigs();
            }
            yield initialization.createDefaultPenalty();
            yield role_1.default.loadRoles();
        });
    },
};
exports.default = initialization;
//# sourceMappingURL=initialization.js.map