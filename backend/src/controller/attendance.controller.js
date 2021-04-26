import { AttendanceService } from '../service/attendance.service'
import { Response } from '../models/Response'

export class AttendanceController {
    static createAttendance = async (req, res, next) => {
        try {
            const result = await AttendanceService.createAttendance(req)
            return res
                .status(201)
                .json(new Response(201, 'create Attendance success', result))
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static deleteAttendances = async (req, res, next) => {
        try {
            const result = await AttendanceService.deleteAttendances(req)
            return res
                .status(200)
                .json(new Response(200, 'delete Attendances success', result))
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static deleteAttendance = async (req, res, next) => {
        try {
            const result = await AttendanceService.deleteAttendance(req)
            return res
                .status(200)
                .json(new Response(200, 'delete Attendance success', result))
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static getAttendanceByDate = async (req, res, next) => {
        try {
            const result = await AttendanceService.getAttendanceByDate(req)
            return res
                .status(200)
                .json(new Response(200, 'get Attendance success', result))
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static getAttendanceByPeriod = async (req, res, next) => {
        try {
            const result = await AttendanceService.getAttendanceByPeriod(req)
            return res
                .status(200)
                .json(new Response(200, 'get Attendance success', result))
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    static updateAttendance = async (req, res, next) => {
        try {
            const result = await AttendanceService.updateAttendance(req)
            return res
                .status(200)
                .json(new Response(200, 'update Attendance success', result))
        } catch (err) {
            console.log(err)
            next(err)
        }
    }
}
