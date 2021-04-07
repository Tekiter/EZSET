import express from 'express';
var router = express.Router();

import { validateParams } from '../../utils/api'
import { perm } from '../../utils/role'
import { param, body, query } from 'express-validator'
import { PenaltyController } from '../../controller/penalty.controller';

router.post(
    '/',
    [
       perm('penalty').can('update'),
       body('type_id').isString(),
       body('type').isString(),
       body('date').isString(),
       body('users').isString(),
       body('description').isString(),
       validateParams,
    ],
    PenaltyController.createPenalty);


export default router
