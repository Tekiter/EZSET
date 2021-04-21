import express from 'express'
var router = express.Router()

import { validateParams } from '../../utils/api'
import { perm } from '../../utils/role'
import { param, body } from 'express-validator'
import { PenaltyConfigController } from '../../controller/penaltyConfig.controller'

router.post(
    '/',
    [
        perm('penalty').can('update'),
        body('key').isString(),
        body('value').isNumeric(),
        validateParams,
    ],
    PenaltyConfigController.createPenaltyConfig
)

router.delete(
    '/:_id',
    [perm('penalty').can('update'), param('_id').isString(), validateParams],
    PenaltyConfigController.deletePenaltyConfig
)

router.get(
    '/',
    [perm('penalty').can('read'), validateParams],
    PenaltyConfigController.getPenaltyConfigs
)

router.patch(
    '/:_id',
    [
        perm('penalty').can('update'),
        param('_id').isString(),
        body('value').isNumeric(),
        validateParams,
    ],
    PenaltyConfigController.updatePenaltyConfig
)

export default router
