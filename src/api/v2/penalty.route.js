import express from 'express'
var router = express.Router()

import { validateParams } from '../../utils/api'
import { perm } from '../../utils/role'
import { param, body } from 'express-validator'
import { PenaltyController } from '../../controller/penalty.controller'

router.post(
    '/',
    [
        perm('penalty').can('update'),
        body('type').isString(),
        body('date').isString(),
        body('users').isArray(),
        body('description').isString(),
        validateParams,
    ],
    PenaltyController.createPenalty
)

router.delete(
    '/:_id',
    [perm('penalty').can('update'), param('_id').isString(), validateParams],
    PenaltyController.deletePenalty
)

router.get(
    '/',
    [perm('penalty').can('read'), validateParams],
    PenaltyController.getPenaltys
)

router.get(
    '/:username',
    [perm('penalty').can('read'), param('username').isString(), validateParams],
    PenaltyController.getPenalty
)
export default router
