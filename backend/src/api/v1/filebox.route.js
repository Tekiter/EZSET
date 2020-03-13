import { Router } from 'express'
import { validateParams, asyncRoute } from '../../utils/api'
import { body, param } from 'express-validator'
import Group from '../../models/filebox/Group'
import Material from '../../models/filebox/Material'
import { perm } from '../../utils/role'
import {
    checkAttachableFileArray,
    checkIsFileOwner,
    checkUnlinkedFile,
    applyFileLink,
    getFileInfoArray,
    removeFileLink,
    deleteUnlinkedFile,
    getFileLinks,
} from '../../utils/file'

const router = Router()

/**
 * @api {get} /filebox/ 자료실 자료 목록
 * @apiName 자료실 자료 목록

 * @apiGroup Filebox
 *
 * @apiSuccess {Array} groups 자료실 자료 목록 배열
 * @apiDescription groups는 배열로 id, name, isfolder, children 이 각각 들어있음
*/
//group 목록 보기
router.get(
    '/',
    [],
    asyncRoute(async (req, res) => {
        // 그룹 트리 순회하는 재귀함수
        const loops = async item => {
            const res = await Group.find()
                .where('parent')
                .equals(item.id)
                .sort('isfolder')

            if (res) {
                for (let children of res) {
                    let temp = {
                        id: children.id,
                        name: children.name,
                        isfolder: children.isfolder,
                        children: [],
                    }
                    item.children.push(temp)
                    await loops(temp)
                }
            }
            return
        }

        const roots = await Group.find()
            .exists('parent', false)
            .sort('isfolder')

        const result = roots.map(root => {
            return {
                id: root.id,
                name: root.name,
                isfolder: root.isfolder,
                children: [],
            }
        })

        for (let root of result) {
            await loops(root)
        }
        res.json({
            groups: result,
        })
    })
)

//group 생성 : group의 부모는 항상  group, 자식은 group(isfolder) 이거나 material
/**
 * @api {post} /group 자료실 그룹(폴더) 생성
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
router.post(
    '/group',
    [
        body('name').isString(),
        body('isfolder').isBoolean(),
        body('parent_id')
            .isMongoId()
            .optional(),
        perm('fileBox').can('manage'),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        let parent
        //부모 id가 없다면 첫 번째 group
        if (req.body.parent_id) {
            parent = await Group.findById(req.body.parent_id)
            if (!parent || parent.isfolder) {
                const err = new Error('올바르지 않은 parent group id 입니다.')
                err.status = 400
                throw err
            }
        }
        let newGroup = new Group()
        newGroup.name = req.body.name
        newGroup.isfolder = req.body.isfolder
        if (req.body.parent_id) newGroup.parent = req.body.parent_id
        await newGroup.save()
        //부모에 새로 만든 그룹의 주소를 자식 배열에 넣어준다
        if (req.body.parent_id) {
            parent.children.push(newGroup.id)
            parent.markModified('children')
            await parent.save()
        }

        res.status(201).json({
            group: {
                id: newGroup.id,
                name: newGroup.name,
            },
        })
    })
)

//group 수정
/**
 * @api {patch} /group:group_id 자료실 그룹(폴더) 이름 수정
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
router.patch(
    '/group/:group_id',
    [
        param('group_id').isMongoId(),
        body('name').isString(),
        body('isfolder').isBoolean(),
        body('parent_id')
            .isMongoId()
            .optional(),
        perm('fileBox').can('manage'),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        let group = await Group.findById(req.params.group_id)
        if (group) {
            group.name = req.body.name
            await group.save()
            res.end()
        } else {
            res.status(404).json({
                message: 'no group id' + req.params.group_id,
            })
        }
    })
)

/**
 * @api {delete} /group/:group_id 자료실 그룹(폴더) 삭제
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
router.delete(
    '/group/:group_id',
    [
        perm('fileBox').can('manage'),
        param('group_id').isMongoId(),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        // 트리 재귀적 삭제 루프
        const loops = async group_id => {
            const group = await Group.findById(group_id)
            if (!group) {
                const err = new Error(
                    '해당 그룹 또는 폴더가 존재하지 않습니다.'
                )
                err.status = 404
                throw err
            }

            if (group.parent) {
                const parent = await Group.findById(group.parent)
                if (parent) {
                    const idx = parent.children.indexOf(group_id)
                    if (idx >= 0) {
                        parent.children.splice(idx, 1)
                    }
                    await parent.save()
                }
            }

            if (group.isfolder) {
                const materials = await Material.find()
                    .where('parent')
                    .equals(group_id)

                for (let material of materials) {
                    await removeFileLink(material.files)
                    await deleteUnlinkedFile(material.files)
                    await material.remove()
                }
                await group.remove()
            } else {
                for (let children of group.children) {
                    await loops(children)
                }
                await group.remove()
            }
        }

        await loops(req.params.group_id)

        res.end()
    })
)

//folder 조회
/**
 * @api {get} /folder/:parent_id 자료실 폴더 조회
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
router.get(
    '/folder/:parent_id',
    [param('parent_id').isMongoId(), validateParams],
    asyncRoute(async (req, res) => {
        const folder = await Group.findById(req.params.parent_id)
        if (!folder) {
            const err = new Error('존재하지 않는 group id 입니다.')
            err.status = 404
            throw err
        }

        const materials = await Material.find()
            .where('parent')
            .equals(req.params.parent_id)
            .sort('-_id')

        const mat = []

        for (let item of materials) {
            mat.push({
                id: item.id,
                title: item.title,
                author: item.author,
                content: item.content,
                created_date: item.created_date,
                files: await getFileInfoArray(item.files),
            })
        }
        res.json({
            folder: {
                name: folder.name,
            },
            materials: mat,
        })
    })
)

//material 생성 : material의 부모는 항상 isfolder
/**
 * @api {post} /folder/:parent_id 자료실 게시물 생성
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
router.post(
    '/folder/:parent_id',
    [
        body('title').isString(),
        body('content').isString(),
        body('files').custom(checkAttachableFileArray),
        param('parent_id').isMongoId(),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        if (
            !req.user.perm('fileBox').can('upload') &&
            !req.user.perm('fileBox').can('manage')
        ) {
            const err = new Error('권한이 없습니다.')
            err.status = 403
            throw err
        }

        const parent = await Group.findById(req.params.parent_id)
        if (!parent) {
            const err = new Error('올바르지 않은 parent id 입니다.')
            err.status = 400
            throw err
        }
        if (
            !checkIsFileOwner(req.body.files) ||
            !checkUnlinkedFile(req.body.files)
        ) {
            const err = new Error('올바르지 않은 첨부파일입니다.')
            err.status = 400
            throw err
        }

        const newMaterial = new Material({
            title: req.body.title,
            author: req.user.username,
            content: req.body.content,
            created_date: Date.now(),
            files: req.body.files,
            parent: req.params.parent_id,
        })
        await newMaterial.save()

        // DB 파일 객체에 역참조 등록
        await applyFileLink(req.body.files, 'filebox', newMaterial.id)
        newMaterial.files = req.body.files

        await newMaterial.save()

        res.status(201).json({
            material: {
                id: newMaterial.id,
                name: newMaterial.title,
            },
        })
    })
)

/**
 * @api {get} /material/:material_id 자료실 게시물 조회
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
router.get(
    '/material/:material_id',
    [param('material_id').isMongoId(), validateParams],
    asyncRoute(async (req, res) => {
        const material = await Material.findById(req.params.material_id)

        if (!material) {
            const err = new Error('존재하지 않는 자료입니다.')
            err.status = 404
            throw err
        }

        res.status(200).json({
            id: material.id,
            folder_id: material.parent,
            title: material.title,
            author: material.author,
            content: material.content,
            created_date: material.created_date,
            files: await getFileInfoArray(material.files),
        })
    })
)

// material 삭제
/**
 * @api {delete} /material/:material_id 자료실 게시물 삭제
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
router.delete(
    '/material/:material_id',
    [param('material_id').isMongoId(), validateParams],
    asyncRoute(async (req, res) => {
        if (
            !req.user.perm('fileBox').can('upload') &&
            !req.user.perm('fileBox').can('manage')
        ) {
            const err = new Error('권한이 없습니다.')
            err.status = 403
            throw err
        }
        const material = await Material.findById(req.params.material_id)

        //파일을 올린 본인이 아니라면 삭제할 수 없도록함
        if (
            req.user.perm('fileBox').can('upload') &&
            material.author != req.user.username
        ) {
            const err = new Error('본인이 아닌경우 파일을 지울 수 없습니다.')
            err.status = 403
            throw err
        }

        if (!material) {
            const err = new Error('존재하지 않는 자료입니다.')
            err.status = 404
            throw err
        }

        await removeFileLink(material.files)
        await deleteUnlinkedFile(material.files)

        await material.delete()

        res.status(200).json({ message: '자료가 삭제되었습니다.' })
    })
)

// material 수정
/**
 * @api {patch} /material/:material_id 자료실 게시물 수정
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
router.patch(
    '/material/:material_id',
    [
        param('material_id').isMongoId(),
        body('title').isString(),
        body('content').isString(),
        body('files').custom(checkAttachableFileArray),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        if (
            !req.user.perm('fileBox').can('upload') &&
            !req.user.perm('fileBox').can('manage')
        ) {
            const err = new Error('권한이 없습니다.')
            err.status = 403
            throw err
        }
        const material = await Material.findById(req.params.material_id)

        if (!material) {
            const err = new Error('존재하지 않는 자료입니다.')
            err.status = 404
            throw err
        }
        if (!checkIsFileOwner(req.body.files)) {
            const err = new Error('올바르지 않은 첨부파일입니다.')
            err.status = 400
            throw err
        }

        // 이미 첨부된 파일을 첨부하는지 검사
        const links = await getFileLinks(req.body.files)
        for (let link of links) {
            if (link.target !== 'filebox' || link.ref !== material.id) {
                const err = new Error('올바르지 않은 첨부파일입니다.')
                err.status = 400
                throw err
            }
        }

        //파일을 올린 본인이 아니라면 수정할 수 없도록함
        if (
            req.user.perm('fileBox').can('upload') &&
            material.author != req.user.username
        ) {
            const err = new Error('본인이 아닌경우 파일을 수정할 수 없습니다.')
            err.status = 403
            throw err
        }

        material.title = req.body.title
        material.content = req.body.content

        const newMaterial = await material.save()
        const prevFiles = newMaterial.files

        await removeFileLink(prevFiles)

        // DB 파일 객체에 역참조 등록
        await applyFileLink(req.body.files, 'filebox', newMaterial.id)
        newMaterial.files = req.body.files

        await newMaterial.save()

        await deleteUnlinkedFile(prevFiles)

        res.status(200).json({ message: '자료가 수정되었습니다.' })
    })
)
export default router
