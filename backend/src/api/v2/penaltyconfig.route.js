import express from 'express';
var router = express.Router();

import { validateParams } from '../../utils/api'
import { perm } from '../../utils/role'
import { param, body, query } from 'express-validator'
import { PenaltyConfigController } from '../../controller/penaltyConfig.controller';

router.post(
    '/',
    [
        perm('penalty').can('update'),
        body('key').isString(),
        body('value').isNumeric(),
        validateParams,
    ],
    PenaltyConfigController.createPenaltyConfig);

export default router
