import { PenaltyConfigService } from '../service/penaltyConfig.service';
import { Response } from '../models/Response';

export class PenaltyConfigController {
    static createPenaltyConfig = async(req,res,next)=>{
        try{
            const result = await PenaltyConfigService.createPenaltyConfig(req);

            return res.status(201).json(new Response(201,'create Penalty success', result));
        }catch(err){
            next(err);
        }
    }
}
