import { Router } from 'express'
import { validateParams, asyncRoute } from '../../utils/api'
import { body, param } from 'express-validator'
import Group from '../../models/filebox/Group'
import Material from '../../models/filebox/Material'
import {
    checkAttachableFileArray,
    checkIsFileOwner,
    checkUnlinkedFile,
    applyFileLink,
    getFileInfoArray,
    removeFileLink,
    deleteUnlinkedFile,
} from '../../utils/file'

const router = Router()

//group 목록 보기
router.get(
    '/',
    [],
    asyncRoute(async (req, res) => {
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
router.post(
    '/group',
    [
        body('name').isString(),
        body('isfolder').isBoolean(),
        body('parent_id')
            .isMongoId()
            .optional(),
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
router.patch(
    '/group/:group_id',
    [
        param('group_id').isNumeric(),
        body('name').isString(),
        body('isfolder').isBoolean(),
        body('parent_id')
            .isMongoId()
            .optional(),
        validateParams,
    ],
    asyncRoute(async function(res, req) {
        let group = await Group.findById(req.params.group_id)
        if (group) {
            group.name = req.body.name
        } else {
            res.status(404).json({
                message: 'no group id' + req.params.group_id,
            })
        }
    })
)

//material 조회
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

// material 삭제
router.delete(
    '/material/:material_id',
    [param('material_id').isMongoId(), validateParams],
    asyncRoute(async (req, res) => {
        const material = await Material.findById(req.params.material_id)

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
router.patch(
    '/material/:material_id',
    [
        param('material_id').isMongoId(),
        body('title').isString(),
        body('content').isString(),
        body('files').custom(checkAttachableFileArray),
        param('parent_id').isMongoId(),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        const material = await Material.findById(req.params.material_id)

        if (!material) {
            const err = new Error('존재하지 않는 자료입니다.')
            err.status = 404
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
        await removeFileLink(material.files)
        await deleteUnlinkedFile(material.files)

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

        res.status(200).json({ message: '자료가 수정되었습니다.' })
    })
)
export default router
