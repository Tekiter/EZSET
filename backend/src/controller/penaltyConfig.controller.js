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

    static deletePenaltyConfig = async(req,res,next)=>{
        try{
            const result = await PenaltyConfigService.deletePenaltyConfig(req);

            return res.status(200).json(new Response(200,'delete Penalty success', result));
        }catch(err){
            next(err);
        }
    }

    static getPenaltyConfigs = async(req,res,next)=>{
        try{
            const result = await PenaltyConfigService.getPenaltyConfigs();

            return res.status(200).json(new Response(200,'get PenaltyConfigs success', result));
        }catch(err){
            next(err);
        }
    }

    static updatePenaltyConfig = async(req,res,next)=>{
        try{
            const result = await PenaltyConfigService.updatePenaltyConfig(req);

            return res.status(200).json(new Response(200,'update PenaltyConfig success', result));
        }catch(err){
            next(err);
        }
    }
}