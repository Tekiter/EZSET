import { Router } from 'express'
import { validateParams, asyncRoute } from '../../utils/api'
import { body } from 'express-validator'
import Group from '../../models/filebox/Group'

const router = Router()

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
            if (req.body.parent_id) {
                parent = await Group.findById(req.body.parent_id)
            }
            let newGroup = new Group()
            newGroup.name = req.body.name
            newGroup.isfolder = req.body.isfolder
            if (req.body.parent_id) newGroup.parent = req.body.parent_id
            await newGroup.save()
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

export default router
