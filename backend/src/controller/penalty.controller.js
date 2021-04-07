import { PenaltyService } from '../service/penalty.service';
import { Response } from '../models/Response';

export class PenaltyController {
    static createPenalty = async(req,res,next)=>{
        try{
            const result = await PenaltyService.createPenalty(req.body);

            return res.status(201).json(new Response(201,'create Penalty success', result));
        }catch(err){
            next(err);
        }
    }
}
