"use strict";
/*
file.js
파일 업로드와 다운로드를 관리하는 모듈

*/
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
exports.getFileLinks = exports.checkUnlinkedFile = exports.checkIsFileOwner = exports.deleteFile = exports.cleanupUnlinkedFiles = exports.deleteUnlinkedFile = exports.removeFileLink = exports.applyFileLink = exports.checkAttachableFileArray = exports.checkAttachableFile = exports.setUploadExpireTimeout = exports.increaseFileHit = exports.getFilePath = exports.getFileInfoArray = exports.getFileInfo = exports.upload = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const File_1 = __importDefault(require("../models/File"));
// 파일이 저장될 디렉토리를 지정
const uploadDir = process.env.FILE_UPLOAD_DIR || path_1.default.join(__dirname, 'upload');
// 업로드 폴더가 없을 시, 생성한다.
try {
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir);
    }
}
catch (error) {
    console.log('Could not create file upload folder: ' + uploadDir); // eslint-disable-line no-console
}
// multer 디스크스토리지 생성
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        // DB에 파일 정보를 생성하고, 생성된 Document의 ID를 파일 명으로 한다.
        const fileobj = new File_1.default({
            filename: file.originalname,
        });
        fileobj.save().then(res => {
            cb(null, fileobj.id);
        });
    },
});
// 파일 업로드 multer 미들웨어
// 파일 외부에서의 직접 접근을 막는다.
const rawUpload = multer_1.default({ storage });
// 업로드된 파일의 정보를 db에 업데이트 하기위한 미들웨어
exports.upload = {
    single(field) {
        return (req, res, next) => {
            const middle = rawUpload.single(field);
            // 파일이 업로드 된 이후에 DB정보 업데이트
            const afterUpload = () => {
                if (!req.file) {
                    res.status(400).json({ error: 'Invalid file upload' });
                    return;
                }
                File_1.default.findById(req.file.filename).then(file => {
                    file.size = req.file.size;
                    file.uploader = req.user.username;
                    file.mimetype = req.file.mimetype;
                    file.save().then(() => {
                        next();
                    });
                });
            };
            if (req.user) {
                // 파일 업로드 미들웨어 실행
                middle(req, res, afterUpload);
            }
            else {
                res.status(401).json({ message: '로그인이 필요합니다.' });
            }
        };
    },
};
/**
 * 파일 ID를 기준으로 파일의 정보를 가져온다.
 * @param {ObjectID} file_id
 */
function getFileInfo(file_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = yield File_1.default.findById(file_id).cache();
        if (!file) {
            return undefined;
        }
        return {
            id: file_id,
            filename: file.filename,
            size: file.size,
            uploader: file.uploader,
            timestamp: file.timestamp,
        };
    });
}
exports.getFileInfo = getFileInfo;
function getFileInfoArray(files) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = [];
        for (let file of files) {
            output.push(yield getFileInfo(file));
        }
        return output;
    });
}
exports.getFileInfoArray = getFileInfoArray;
/**
 * 파일의 ID를 기준으로 실제 파일 경로를 가져온다.
 * @param {ObjectID} file_id
 */
function getFilePath(file_id) {
    return path_1.default.join(uploadDir, file_id);
}
exports.getFilePath = getFilePath;
/**
 * 파일 다운로드 횟수를 1 증가시킨다.
 * @param {ObjectID} file_id
 */
function increaseFileHit(file_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = yield File_1.default.findById(file_id).cache();
        yield file.increaseHit();
    });
}
exports.increaseFileHit = increaseFileHit;
function setUploadExpireTimeout(fileId, timeout) {
    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        const file = yield File_1.default.findById(fileId);
        if (!file.hasLink()) {
            yield deleteFile(fileId);
        }
    }), timeout);
}
exports.setUploadExpireTimeout = setUploadExpireTimeout;
/**
 * 첨부가 가능한, 즉 역참조가 없는 파일인지 체크
 * @param {*} fileId 파일의 ID
 */
function checkAttachableFile(fileId) {
    return __awaiter(this, void 0, void 0, function* () {
        // let file
        try {
            yield File_1.default.findById(fileId + '');
        }
        catch (error) {
            throw new Error('올바르지 않은 파일 ID 입니다.');
        }
        // if (file.hasLink()) {
        //     throw new Error('이미 첨부된 파일입니다.')
        // }
        return true;
    });
}
exports.checkAttachableFile = checkAttachableFile;
/**
 * 첨부가 가능한 파일 ID의 배열인지 체크
 * @param {*} files 파일 ID들이 들어있는 배열
 */
function checkAttachableFileArray(files) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(files)) {
            throw new Error('올바르지 않은 파일 ID 배열입니다.');
        }
        for (let fileId of files) {
            yield checkAttachableFile(fileId);
        }
        return true;
    });
}
exports.checkAttachableFileArray = checkAttachableFileArray;
/**
 * 파일 오브젝트에 역참조를 등록한다.
 * @param {*} files
 * @param {*} target
 * @param {*} ref
 */
function applyFileLink(files, target, ref) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(files)) {
            files = [files];
        }
        for (let fileId of files) {
            const file = yield File_1.default.findById(fileId);
            file.link = {
                target,
                ref,
            };
            file.markModified('link');
            yield file.save();
        }
    });
}
exports.applyFileLink = applyFileLink;
/**
 * 파일 오브젝트에 역참조를 제거한다.
 * @param {*} files
 */
function removeFileLink(files) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(files)) {
            files = [files];
        }
        for (let fileId of files) {
            const file = yield File_1.default.findById(fileId);
            file.link = {};
            file.markModified('link');
            yield file.save();
        }
    });
}
exports.removeFileLink = removeFileLink;
/**
 * 역참조가 없는 파일을 삭제한다.
 * @param {*} files
 */
function deleteUnlinkedFile(files) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(files)) {
            files = [files];
        }
        for (let fileId of files) {
            const file = yield File_1.default.findById(fileId);
            if (file && !file.hasLink()) {
                yield deleteFile(fileId);
            }
        }
    });
}
exports.deleteUnlinkedFile = deleteUnlinkedFile;
function cleanupUnlinkedFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        const allFiles = yield File_1.default.find();
        yield deleteUnlinkedFile(allFiles.map(file => {
            return file.id;
        }));
    });
}
exports.cleanupUnlinkedFiles = cleanupUnlinkedFiles;
/**
 * 해당 파일을 삭제한다.
 * @param {*} fileId
 */
function deleteFile(fileId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = yield File_1.default.findById(fileId);
            try {
                yield fs_1.default.promises.unlink(path_1.default.join(uploadDir, file.id));
            }
            catch (error) {
                //
            }
            yield file.remove();
        }
        catch (error) { }
    });
}
exports.deleteFile = deleteFile;
/**
 * 파일들이 모두 특정 유저가 올린 것인지 확인한다.
 * @param {*} files 파일 ID 또는 파일 ID의 배열
 * @param {*} username 판단할 유저
 */
function checkIsFileOwner(files, username) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(files)) {
            files = [files];
        }
        for (let fileId of files) {
            const file = yield File_1.default.findById(fileId);
            if (file.uploader !== username) {
                return false;
            }
        }
        return true;
    });
}
exports.checkIsFileOwner = checkIsFileOwner;
/**
 * 파일들이 모두 역참조가 존재하지 않는지 확인한다.
 * @param {*} files
 */
function checkUnlinkedFile(files) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(files)) {
            files = [files];
        }
        for (let fileId of files) {
            const file = yield File_1.default.findById(fileId);
            if (file.hasLink()) {
                return false;
            }
        }
        return true;
    });
}
exports.checkUnlinkedFile = checkUnlinkedFile;
function getFileLinks(files) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(files)) {
            files = [files];
        }
        const res = [];
        for (let fileId of files) {
            const file = yield File_1.default.findById(fileId);
            if (file.hasLink()) {
                res.push({
                    target: file.link.target,
                    ref: file.link.ref,
                });
            }
        }
        return res;
    });
}
exports.getFileLinks = getFileLinks;
//# sourceMappingURL=file.js.map