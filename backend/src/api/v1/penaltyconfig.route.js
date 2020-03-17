import Router from 'express'
import { asyncRoute, validateParams } from '../../utils/api'
import PenaltyConfig from '../../models/Penalty/PenaltyConfig'
import { perm } from '../../utils/role'
import { body } from 'express-validator'
const router = Router()

//get config
router.get(
    '/read', [perm('attendance').canOwn('read')],
    asyncRoute(async function(req, res) {
        const cursor = await PenaltyConfig.find()
        res.json(cursor)
    })
)

//write config
router.post(
    '/write', [
        perm('attendance').can('update'),
        body('key').isString(),
        body('value').isNumeric(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        const cnt = await PenaltyConfig.find()
            .where('key')
            .equals(req.body.key)
            .count()
        if (cnt > 0) return res.status(406).json()
        var penaltyConfig = new PenaltyConfig()
        penaltyConfig.key = req.body.key
        penaltyConfig.value = req.body.value
        penaltyConfig.save()
        res.end()
    })
)

//delete config
router.post(
    '/delete', [perm('attendance').can('update'), body('key').isString(), validateParams],
    asyncRoute(async function(req, res) {
        if (req.body.key == '지각') {
            const err = new Error('지각 항목은 삭제할 수 없습니다.')
            err.status = 400
            throw err
        }
        if (req.body.key == '결석') {
            const err = new Error('결석 항목은 삭제할 수 없습니다.')
            err.status = 400
            throw err
        }
        await PenaltyConfig.findOneAndDelete({
            key: req.body.key,
        })
        res.end()
    })
)

//update config
router.post(
    '/update', [
        perm('attendance').can('update'),
        body('key').isString(),
        body('value').isNumeric(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        await PenaltyConfig.findOneAndUpdate({
            key: req.body.key,
        }, {
            value: req.body.value,
        })
        res.end()
    })
)
export default router