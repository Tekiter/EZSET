import { PenaltyService } from '../service/penalty.service';
import { Response } from '../models/Response';
import apm from 'elastic-apm-node'
export class PenaltyController {
    static createPenalty = async(req,res,next)=>{
        try{
            var span = apm.startSpan('service')
            apm.setTransactionName(req.path);
            const result = await PenaltyService.createPenalty(req.body);
            if(span) span.end();
            return res.status(201).json(new Response(201,'create Penalty success', result));
            
        }catch(err){
            next(err);
        }
    }

    static deletePenalty = async(req,res,next)=>{
        try{       
            var span = apm.startSpan('service')
            const result = await PenaltyService.deletePenalty(req.params);
            if(span) span.end();
            return res.status(200).json(new Response(200,'delete Penalty success',result));
        }catch(err){
            next(err);
        }
    }

    static getPenaltys = async(req,res,next)=>{
        try{
            var span = apm.startSpan('service')
            apm.setTransactionName(`${req.method} - ${req.originalUrl}`);
            const result = await PenaltyService.getPenaltys(req);
            if(span) span.end();
            return res.status(200).json(new Response(200,'get Penalty success',result));
        }catch(err){
            next(err);
        }
    }
    
     static getPenalty = async(req,res,next)=>{
        try{
            var span = apm.startSpan('service')
            apm.setTransactionName(`${req.method} - ${req.originalUrl}`);
            const result = await PenaltyService.getPenalty(req);
            if(span) span.end();
            return res.status(200).json(new Response(200,'get Penalty success',result));
        }catch(err){
            next(err);
        }
    }
}
