'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _file = require('../../utils/file');

var _api = require('../../utils/api');

var _expressValidator = require('express-validator');

var _role = require('../../utils/role');

const router = (0, _express.Router)();

// 업로드 된 파일의 정보 획득
/*
file.route.js
파일 업로드와 다운로드를 관리하는 Route

*/

router.get('/info/:file_id', [(0, _expressValidator.param)('file_id').isMongoId(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    const fileinfo = await (0, _file.getFileInfo)(req.params.file_id);
    if (fileinfo) {
        res.json(fileinfo);
    } else {
        // await deleteFile(req.params.file_id)
        const err = new Error('존재하지 않는 파일입니다.');
        err.status = 404;
        throw err;
    }
}));

// 파일을 업로드
router.post('/upload', _file.upload.single('file'), (0, _api.asyncRoute)(async (req, res) => {
    // 업로드 이후 5분동안 첨부가 없으면, 파일을 자동 삭제한다.
    (0, _file.setUploadExpireTimeout)(req.file.filename, 300000);

    res.json({
        id: req.file.filename,
        size: req.file.size
    });
}));

// 파일을 다운로드
router.get('/download/:file_id', [(0, _expressValidator.param)('file_id').isMongoId(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    const fileinfo = await (0, _file.getFileInfo)(req.params.file_id);
    if (fileinfo) {
        const fullpath = (0, _file.getFilePath)(req.params.file_id);
        res.download(fullpath, fileinfo.filename, async err => {
            if (err) {
                res.status(404).json({
                    message: '삭제된 파일입니다.'
                });
            } else {
                await (0, _file.increaseFileHit)(req.params.file_id);
            }
        });
    } else {
        res.status(404).json({ message: '존재하지 않는 파일입니다.' });
    }
}));

router.post('/manage/cleanup', [(0, _role.perm)('manageServer').can('access'), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    await (0, _file.cleanupUnlinkedFiles)();
    res.status(200).end();
}));
exports.default = router;
//# sourceMappingURL=file.route.js.map