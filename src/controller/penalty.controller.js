import { PenaltyService } from '../service/penalty.service'
import { Response } from '../models/Response'

export class PenaltyController {
    static createPenalty = async (req, res, next) => {
        try {
            const result = await PenaltyService.createPenalty(req.body)

            return res
                .status(201)
                .json(new Response(201, 'create Penalty success', result))
        } catch (err) {
            next(err)
        }
    }

    static deletePenalty = async (req, res, next) => {
        try {
            const result = await PenaltyService.deletePenalty(req.params)

            return res
                .status(200)
                .json(new Response(200, 'delete Penalty success', result))
        } catch (err) {
            next(err)
        }
    }

    static getPenaltys = async (req, res, next) => {
        try {
            const result = await PenaltyService.getPenaltys(req)

            return res
                .status(200)
                .json(new Response(200, 'get Penalty success', result))
        } catch (err) {
            next(err)
        }
    }

    static getPenalty = async (req, res, next) => {
        try {
            const result = await PenaltyService.getPenalty(req)

            return res
                .status(200)
                .json(new Response(200, 'get Penalty success', result))
        } catch (err) {
            next(err)
        }
    }
}
