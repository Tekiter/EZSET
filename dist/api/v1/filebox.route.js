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
const express_1 = require("express");
const api_1 = require("../../utils/api");
const express_validator_1 = require("express-validator");
const Group_1 = __importDefault(require("../../models/filebox/Group"));
const Material_1 = __importDefault(require("../../models/filebox/Material"));
const role_1 = require("../../utils/role");
const file_1 = require("../../utils/file");
const router = express_1.Router();
/**
 * @api {get} /filebox/ 자료실 자료 목록
 * @apiName 자료실 자료 목록

 * @apiGroup Filebox
 *
 * @apiSuccess {Array} groups 자료실 자료 목록 배열
 * @apiDescription groups는 배열로 id, name, isfolder, children 이 각각 들어있음
*/
//group 목록 보기
router.get('/', [], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 그룹 트리 순회하는 재귀함수
    const loops = (item) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield Group_1.default.find()
            .where('parent')
            .equals(item.id)
            .sort('isfolder');
        if (res) {
            for (let children of res) {
                let temp = {
                    id: children.id,
                    name: children.name,
                    isfolder: children.isfolder,
                    children: [],
                };
                item.children.push(temp);
                yield loops(temp);
            }
        }
        return;
    });
    const roots = yield Group_1.default.find()
        .exists('parent', false)
        .sort('isfolder');
    const result = roots.map(root => {
        return {
            id: root.id,
            name: root.name,
            isfolder: root.isfolder,
            children: [],
        };
    });
    for (let root of result) {
        yield loops(root);
    }
    res.json({
        groups: result,
    });
})));
//group 생성 : group의 부모는 항상  group, 자식은 group(isfolder) 이거나 material
/**
 * @api {post} /filebox/group 자료실 그룹(폴더) 생성
 * @apiName 자료실 그룹 생성
 * @apiGroup Filebox
 *
 * @apiParam {String} name 그룹(폴더) 이름
 * @apiParam {Boolean} isfolder 그룹, 폴더를 나누는 변수
 * @apiParam {String} parent_id 부모 ID
 *
 * @apiSuccess {Number} 201 자료실 그룹(폴더) 생성 성공
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 201
 *          {
 *              group: {
 *                  id: newGroup.id,
 *                  name: newGroup.name,
 *          }
 *
 * @apiError {Number} 400 자료실 그룹(폴더) 생성 실패 에러
 * @apiErrorExample Error-Response:
 *       HTTP/1.1 400
 *       {
 *          '올바르지 않은 parent group id 입니다.',
 *       }
 *
 * @apiPermission can.manage
 */
router.post('/group', [
    express_validator_1.body('name').isString(),
    express_validator_1.body('isfolder').isBoolean(),
    express_validator_1.body('parent_id')
        .isMongoId()
        .optional(),
    role_1.perm('fileBox').can('manage'),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let parent;
    //부모 id가 없다면 첫 번째 group
    if (req.body.parent_id) {
        parent = yield Group_1.default.findById(req.body.parent_id);
        if (!parent || parent.isfolder) {
            const err = new Error('올바르지 않은 parent group id 입니다.');
            err.status = 400;
            throw err;
        }
    }
    let newGroup = new Group_1.default();
    newGroup.name = req.body.name;
    newGroup.isfolder = req.body.isfolder;
    if (req.body.parent_id)
        newGroup.parent = req.body.parent_id;
    yield newGroup.save();
    //부모에 새로 만든 그룹의 주소를 자식 배열에 넣어준다
    if (req.body.parent_id) {
        parent.children.push(newGroup.id);
        parent.markModified('children');
        yield parent.save();
    }
    res.status(201).json({
        group: {
            id: newGroup.id,
            name: newGroup.name,
        },
    });
})));
//group 수정
/**
 * @api {patch} /filebox/group:group_id 자료실 그룹(폴더) 이름 수정
 * @apiName 자료실 그룹 이름 수정
 * @apiGroup Filebox
 *
 * @apiParam {String} group_id 그룹(폴더) ID
 * @apiParam {String} name 그룹(폴더) 이름
 * @apiParam {Boolean} isfolder 그룹, 폴더를 나누는 변수
 * @apiParam {String} parent_id 부모 ID
 *
 * @apiSuccess {Number} 200 자료실 그룹(폴더) 이름 수정 성공
 *
 * @apiError {Number} 404 지료실 그룹(폴더) 수정 실패 에러
 * @apiErrorExample {json} Error-Response:
 *       HTTP/1.1 404
 *       {
 *          message: 'no group id' + req.params.group_id,
 *       }
 *
 * @apiPermission can.manage
 */
router.patch('/group/:group_id', [
    express_validator_1.param('group_id').isMongoId(),
    express_validator_1.body('name').isString(),
    express_validator_1.body('isfolder').isBoolean(),
    express_validator_1.body('parent_id')
        .isMongoId()
        .optional(),
    role_1.perm('fileBox').can('manage'),
    api_1.validateParams,
], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let group = yield Group_1.default.findById(req.params.group_id);
        if (group) {
            group.name = req.body.name;
            yield group.save();
            res.end();
        }
        else {
            res.status(404).json({
                message: 'no group id' + req.params.group_id,
            });
        }
    });
}));
/**
 * @api {delete} /filebox/group/:group_id 자료실 그룹(폴더) 삭제
 * @apiName 자료실 그룹 삭제
 * @apiGroup Filebox
 *
 * @apiParam {String} group_id 그룹(폴더) ID
 *
 * @apiSuccess {Number} 200 자료실 그룹(폴더) 삭제 성공
 *
 * @apiError {Number} 404 자료실 그룹(폴더) 수정 실패 에러
 * @apiErrorExample Error-Response:
 *       HTTP/1.1 404
 *       {
 *          '해당 그룹 또는 폴더가 존재하지 않습니다.'
 *       }
 *
 * @apiPermission can.manage
 */
router.delete('/group/:group_id', [
    role_1.perm('fileBox').can('manage'),
    express_validator_1.param('group_id').isMongoId(),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 트리 재귀적 삭제 루프
    const loops = (group_id) => __awaiter(void 0, void 0, void 0, function* () {
        const group = yield Group_1.default.findById(group_id);
        if (!group) {
            const err = new Error('해당 그룹 또는 폴더가 존재하지 않습니다.');
            err.status = 404;
            throw err;
        }
        if (group.parent) {
            const parent = yield Group_1.default.findById(group.parent);
            if (parent) {
                const idx = parent.children.indexOf(group_id);
                if (idx >= 0) {
                    parent.children.splice(idx, 1);
                }
                yield parent.save();
            }
        }
        if (group.isfolder) {
            const materials = yield Material_1.default.find()
                .where('parent')
                .equals(group_id);
            for (let material of materials) {
                yield file_1.removeFileLink(material.files);
                yield file_1.deleteUnlinkedFile(material.files);
                yield material.remove();
            }
            yield group.remove();
        }
        else {
            for (let children of group.children) {
                yield loops(children);
            }
            yield group.remove();
        }
    });
    yield loops(req.params.group_id);
    res.end();
})));
//folder 조회
/**
 * @api {get} /filebox/folder/:parent_id 자료실 폴더 조회
 * @apiName 자료실 폴더 조회
 * @apiGroup Filebox
 *
 * @apiParam {String} parent_id 부모 폴더 ID
 *
 * @apiSuccess {Number} 200 자료실 폴더 조회 성공
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200
 *          {
 *              folder: {
 *                  name: folder.name,
 *              },
 *              materials: mat,
 *          }
 *
 * @apiError {Number} 404 자료실 게시물 폴더 조회 실패 에러
 * @apiErrorExample Error-Response:
 *       HTTP/1.1 404
 *       {
 *          '존재하지 않는 group id 입니다.',
 *       }
 */
router.get('/folder/:parent_id', [express_validator_1.param('parent_id').isMongoId(), api_1.validateParams], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const folder = yield Group_1.default.findById(req.params.parent_id);
    if (!folder) {
        const err = new Error('존재하지 않는 group id 입니다.');
        err.status = 404;
        throw err;
    }
    const materials = yield Material_1.default.find()
        .where('parent')
        .equals(req.params.parent_id)
        .sort('-_id');
    const mat = [];
    for (let item of materials) {
        mat.push({
            id: item.id,
            title: item.title,
            author: item.author,
            content: item.content,
            created_date: item.created_date,
            files: yield file_1.getFileInfoArray(item.files),
        });
    }
    res.json({
        folder: {
            name: folder.name,
        },
        materials: mat,
    });
})));
//material 생성 : material의 부모는 항상 isfolder
/**
 * @api {post} /filebox/folder/:parent_id 자료실 게시물 생성
 * @apiName 자료실 게시물 생성
 * @apiGroup Filebox
 *
 * @apiParam {String} title 게시물 이름
 * @apiParam {String} content 게시물 내용
 * @apiParam {Array} files 업로드된 파일 ID 들의 배열
 * @apiParam {String} parent_id  부모 폴더의 ID
 *
 * @apiSuccess {Number} 201 자료실 게시물 생성 성공
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 201
 *          {
 *              material: {
 *              id: newMaterial.id,
 *              name: newMaterial.title,
 *          }
 *
 * @apiError {Number} 400 자료실 게시물 생성 실패 에러
 * @apiErrorExample Error-Response:
 *       HTTP/1.1 400
 *       {
 *          '올바르지 않은 parent id 입니다.',
 *       }
 * @apiErrorExample Error-Response:
 *       HTTP/1.1 400
 *       {
 *          '올바르지 않은 첨부파일입니다.',
 *       }
 *
 * @apiError {Number} 403 자료실 게시물 생성 권한 에러
 * @apiErrorExample Error-Response:
 *       HTTP/1.1 403
 *       {
 *          '권한이 없습니다.',
 *       }
 *
 *
 * @apiPermission can.manage
 * @apiPermission can.upload
 */
router.post('/folder/:parent_id', [
    express_validator_1.body('title').isString(),
    express_validator_1.body('content').isString(),
    express_validator_1.body('files').custom(file_1.checkAttachableFileArray),
    express_validator_1.param('parent_id').isMongoId(),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user.perm('fileBox').can('upload') &&
        !req.user.perm('fileBox').can('manage')) {
        const err = new Error('권한이 없습니다.');
        err.status = 403;
        throw err;
    }
    const parent = yield Group_1.default.findById(req.params.parent_id);
    if (!parent) {
        const err = new Error('올바르지 않은 parent id 입니다.');
        err.status = 400;
        throw err;
    }
    if (!file_1.checkIsFileOwner(req.body.files) ||
        !file_1.checkUnlinkedFile(req.body.files)) {
        const err = new Error('올바르지 않은 첨부파일입니다.');
        err.status = 400;
        throw err;
    }
    const newMaterial = new Material_1.default({
        title: req.body.title,
        author: req.user.username,
        content: req.body.content,
        created_date: Date.now(),
        files: req.body.files,
        parent: req.params.parent_id,
    });
    yield newMaterial.save();
    // DB 파일 객체에 역참조 등록
    yield file_1.applyFileLink(req.body.files, 'filebox', newMaterial.id);
    newMaterial.files = req.body.files;
    yield newMaterial.save();
    res.status(201).json({
        material: {
            id: newMaterial.id,
            name: newMaterial.title,
        },
    });
})));
/**
 * @api {get} /filebox/material/:material_id 자료실 게시물 조회
 * @apiName 자료실 게시물 조회
 * @apiGroup Filebox
 *
 * @apiParam {String} material_id 게시물 ID
 *
 * @apiSuccess {Number} 200 자료실 게시물 조회 성공
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200
 *          {
 *              id: material.id,
 *              folder_id: material.parent,
 *              title: material.title,
 *              author: material.author,
 *              content: material.content,
 *              created_date: material.created_date,
 *              files: await getFileInfoArray(material.files),
 *          }
 *
 * @apiError {Number} 404 자료실 게시물 조회 실패 에러
 * @apiErrorExample Error-Response:
 *       HTTP/1.1 404
 *       {
 *          '존재하지 않는 자료입니다.',
 *       }
 */
router.get('/material/:material_id', [express_validator_1.param('material_id').isMongoId(), api_1.validateParams], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const material = yield Material_1.default.findById(req.params.material_id);
    if (!material) {
        const err = new Error('존재하지 않는 자료입니다.');
        err.status = 404;
        throw err;
    }
    res.status(200).json({
        id: material.id,
        folder_id: material.parent,
        title: material.title,
        author: material.author,
        content: material.content,
        created_date: material.created_date,
        files: yield file_1.getFileInfoArray(material.files),
    });
})));
// material 삭제
/**
 * @api {delete} /filebox/material/:material_id 자료실 게시물 삭제
 * @apiName 자료실 게시물 삭제
 * @apiGroup Filebox
 *
 * @apiParam {String} material_id 게시물 ID
 *
 * @apiSuccess {Number} 200 자료실 게시물 삭제 성공
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200
 *          {
 *              message: '자료가 삭제되었습니다.'
 *          }
 *
 * @apiError {Number} 403 자료실 게시물 삭제 권한 에러
 * @apiErrorExample Error-Response:
 *       HTTP/1.1 403
 *       {
 *          '권한이 없습니다.',
 *       }
 * @apiErrorExample Error-Response:
 *       HTTP/1.1 403
 *       {
 *          '본인이 아닌경우 파일을 지울 수 없습니다.',
 *       }
 *
 * @apiError {Number} 404 자료실 게시물 삭제 실패 에러
 * @apiErrorExample Error-Response:
 *       HTTP/1.1 404
 *       {
 *          '존재하지 않는 자료입니다.',
 *       }
 *
 * @apiPermission can.manage
 * @apiPermission can.upload
 */
router.delete('/material/:material_id', [express_validator_1.param('material_id').isMongoId(), api_1.validateParams], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const material = yield Material_1.default.findById(req.params.material_id);
    if (!req.user.perm('fileBox').can('manage')) {
        //파일을 올린 본인이 아니라면 삭제할 수 없도록함
        if (req.user.perm('fileBox').can('upload') &&
            material.author != req.user.username) {
            const err = new Error('본인이 아닌경우 파일을 지울 수 없습니다.');
            err.status = 403;
            throw err;
        }
    }
    if (!material) {
        const err = new Error('존재하지 않는 자료입니다.');
        err.status = 404;
        throw err;
    }
    yield file_1.removeFileLink(material.files);
    yield file_1.deleteUnlinkedFile(material.files);
    yield material.delete();
    res.status(200).json({ message: '자료가 삭제되었습니다.' });
})));
// material 수정
/**
 * @api {patch} /filebox/material/:material_id 자료실 게시물 수정
 * @apiName 자료실 게시물 수정
 * @apiGroup Filebox
 *
 * @apiParam {String} material_id 게시물 ID
 * @apiParam {String} title 게시물 이름
 * @apiParam {String} content 게시물 내용
 * @apiParam {Array} files 업로드된 파일 ID 들의 배열
 *
 * @apiSuccess {Number} 200 자료실 게시물 수정 성공
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200
 *          {
 *              message: '자료가 수정되었습니다.'
 *          }
 *
 * @apiError {Number} 400 자료실 게시물 첨부파일 수정 에러
 * @apiErrorExample Error-Response:
 *       HTTP/1.1 400
 *       {
 *          '올바르지 않은 첨부파일입니다.',
 *       }
 *
 * @apiError {Number} 403 자료실 게시물 수정 권한 에러
 * @apiErrorExample Error-Response:
 *       HTTP/1.1 403
 *       {
 *          '권한이 없습니다.',
 *       }
 * @apiErrorExample Error-Response:
 *       HTTP/1.1 403
 *       {
 *          '본인이 아닌경우 파일을 지울 수 없습니다.',
 *       }
 *
 * @apiError {Number} 404 자료실 게시물 수정 실패 에러
 * @apiErrorExample Error-Response:
 *       HTTP/1.1 404
 *       {
 *          '존재하지 않는 자료입니다.',
 *       }
 *
 * @apiPermission can.manage
 * @apiPermission can.upload
 */
router.patch('/material/:material_id', [
    express_validator_1.param('material_id').isMongoId(),
    express_validator_1.body('title').isString(),
    express_validator_1.body('content').isString(),
    express_validator_1.body('files').custom(file_1.checkAttachableFileArray),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const material = yield Material_1.default.findById(req.params.material_id);
    if (!req.user.perm('fileBox').can('manage')) {
        //파일을 올린 본인이 아니라면 수정할 수 없도록함
        if (req.user.perm('fileBox').can('upload') &&
            material.author != req.user.username) {
            const err = new Error('본인이 아닌경우 파일을 수정할 수 없습니다.');
            err.status = 403;
            throw err;
        }
    }
    if (!material) {
        const err = new Error('존재하지 않는 자료입니다.');
        err.status = 404;
        throw err;
    }
    if (!file_1.checkIsFileOwner(req.body.files)) {
        const err = new Error('올바르지 않은 첨부파일입니다.');
        err.status = 400;
        throw err;
    }
    // 이미 첨부된 파일을 첨부하는지 검사
    const links = yield file_1.getFileLinks(req.body.files);
    for (let link of links) {
        if (link.target !== 'filebox' || link.ref !== material.id) {
            const err = new Error('올바르지 않은 첨부파일입니다.');
            err.status = 400;
            throw err;
        }
    }
    material.title = req.body.title;
    material.content = req.body.content;
    const newMaterial = yield material.save();
    const prevFiles = newMaterial.files;
    yield file_1.removeFileLink(prevFiles);
    // DB 파일 객체에 역참조 등록
    yield file_1.applyFileLink(req.body.files, 'filebox', newMaterial.id);
    newMaterial.files = req.body.files;
    yield newMaterial.save();
    yield file_1.deleteUnlinkedFile(prevFiles);
    res.status(200).json({ message: '자료가 수정되었습니다.' });
})));
exports.default = router;
//# sourceMappingURL=filebox.route.js.map