'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _api = require('../../utils/api');

var _role = require('../../utils/role');

var _expressValidator = require('express-validator');

var _PreUser = require('../../models/PreUser');

var _PreUser2 = _interopRequireDefault(_PreUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();

// 승인 대기중인 유저 목록 가져오기
router.get('/', [(0, _role.perm)('managePreusers').can('access')], (0, _api.asyncRoute)(async (req, res) => {
    const users = await _PreUser2.default.find();

    res.json({
        users: users.map(user => {
            return {
                username: user.username,
                timestamp: user.timestamp,
                realname: user.info.realname,
                email: user.info.email
            };
        })
    });
}));

// 유저를 정회원으로 승인
router.post('/:username', [(0, _role.perm)('managePreusers').can('access'), (0, _expressValidator.param)('username').isString(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    const user = await _PreUser2.default.findOne().where('username').equals(req.params.username);
    if (!user) {
        const err = new Error('해당 유저가 존재하지 않습니다.');
        err.status = 400;
        throw err;
    }

    await user.accept();

    await user.remove();

    res.end();
}));

// 유저 승인 거절
router.delete('/:username', [(0, _role.perm)('managePreusers').can('access'), (0, _expressValidator.param)('username').isString(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    const user = await _PreUser2.default.findOne().where('username').equals(req.params.username);
    if (!user) {
        const err = new Error('해당 유저가 존재하지 않습니다.');
        err.status = 400;
        throw err;
    }

    await user.remove();

    res.end();
}));

exports.default = router;
//# sourceMappingURL=preuser.route.js.map