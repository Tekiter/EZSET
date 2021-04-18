import express from 'express';
var router = express.Router();

import { validateParams } from '../../utils/api'
import { perm } from '../../utils/role'
import { param, body, query } from 'express-validator'
import { AttendanceController } from '../../controller/attendance.controller'

router.post(
    '/',
    [
       perm('attendance').can('att'),
       body('username').isString(),
       body('realname').isString(),
       body('state').isString(),
       body('date').isString(),
       validateParams,
    ],
    AttendanceController.createAttendance);

router.delete(
    '/',
    [
        perm('attendance').can('update'),
        query('startDate').isString(),
        query('endDate').isString(),
        validateParams,
    ],
    AttendanceController.deleteAttendances);

router.get(
    '/:date',
    [
        perm('attendance').can('att'),
        param('date').isString(),
        validateParams,
    ],
    AttendanceController.getAttendanceByDate);

router.get(
    '/:username/date',
    [
        perm('attendance').canOwn('read'),
        param('username').isString(),
        query('startDate').isString(),
        query('endDate').isString(),
        validateParams,
    ],
    AttendanceController.getAttendanceByPeriod);

router.patch(
    '/:username/:date',
    [
        perm('attendance').can('update'),
        param('username').isString(),
        param('date').isString(),
        body('state').isString(),
        validateParams,
    ],
    AttendanceController.updateAttendance);

export default router
