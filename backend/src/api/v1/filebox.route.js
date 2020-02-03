import { Router } from 'express'
import { validateParams, asyncRoute } from '../../utils/api'
import { body } from 'express-validator'
import Group from '../../models/filebox/Group'
import Material from '../../models/filebox/Material'
import { checkAttachableFileArray } from '../../utils/file'

const router = Router()

router.route('/').get(
    asyncRoute(async (req, res) => {
        const groups = await Group.find()
        res.json(
            groups.map(group => {
                return {
                    _id: board._id,
                    title: board.title,
                }
            })
        )
    })
)
//group 생성 : group의 부모는 항상  group, 자식은 group(isfolder) 이거나 material
router.route('/group').post(
    [
        body('name').isString(),
        body('isfolder').isBoolean(),
        body('parent_id')
            .isMongoId()
            .optional(),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        try {
            let parent
            //부모 id가 없다면 첫 번째 group
            if (req.body.parent_id) {
                parent = await Group.findById(req.body.parent_id)
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
        } catch (error) {
            const err = new Error('group을 생성할 수 없습니다')
            err.status = 400
            throw err
        }
    })
)

//material 생성 : material의 부모는 항상 isfolder
router.route('/material').post(
    [
        body('title').isString(),
        body('content').isString(),
        body('files').custom(checkAttachableFileArray),
        body('parent_id').isMongoId(),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        try {
            let parent = await Group.findById(req.body.parent_id)

            let newMaterial = new Material()
            newMaterial.title = req.body.title
            newMaterial.author = req.user.username
            newMaterial.content = req.body.content
            newMaterial.created_date = Date.now()
            newMaterial.files = req.body.files
            newMaterial.parent = req.body.parent_id
            await newMaterial.save()

            parent.children.push(newMaterial.id)
            parent.markModified('children')
            await parent.save()

            res.status(201).json({
                material: {
                    id: newMaterial.id,
                    name: newMaterial.title,
                },
            })
        } catch (error) {
            const err = new Error('material을 생성할 수 없습니다')
            err.status = 400
            throw err
        }
    })
)
export default router
