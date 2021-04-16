import { PenaltyDao } from '../dao/penalty.dao';
import {handleError} from '../models/Error';
export class PenaltyService {
  static createPenalty = async(req)=>{
      const {users, type,description,date} = req;
      try{
          let result =[];
          users.forEach(username => {
              var span = apm.startSpan('dao')
              result.push(PenaltyDao.createPenalty(username,type,description,date));
              if(span) span.end();
          });
          return result;
      }catch(err){
          throw new handleError(404,'Create Penalty fail');
      }
  };

  static deletePenalty = async(req)=>{
      const {_id} = req;
      try{
          var span = apm.startSpan('dao')
          const result = await PenaltyDao.deletePenalty(_id);
          if(result.n == 0){
            throw new handleError(404,'Penalty not found');  
          }
          if(span) span.end();
          return result;
      }catch(err){
            throw new handleError(404,'Delete Penalty fail');
      }
  }
  
  static getPenaltys = async(req)=>{
      var span = apm.startSpan('dao')
      const {start,end} = req.query;
      try{
          const result = await PenaltyDao.getPenaltys(start,end);
          if(span) span.end();
          return result;
      }catch(err){
          throw new handleError(404,'Penalty not found');
      }
  }

  static getPenalty = async(req)=>{
      var span = apm.startSpan('dao')
      const {username} = req.params;
      const {start,end} = req.query;
      try{
          var span = apm.startSpan('dao')
          const result = await PenaltyDao.getPenalty(username,start,end);
          if(span) span.end();
          return result;
      }catch(err){
          throw new handleError(404,'Penalty not found');
      }
  }
}
