import { PenaltyDao } from '../dao/penalty.dao';
import {handleError} from '../models/Error';
export class PenaltyService {
  static createPenalty = async(req)=>{
      const {users, type,description,date} = req;
      try{
          let result =[];
          users.forEach(async username => {
              result.push(await PenaltyDao.createPenalty(username,type,description,date));
          });
          return result;
      }catch(err){
          throw new handleError(404,'Create Penalty fail');
      }
  };

  static deletePenalty = async(req)=>{
      const {_id} = req;
      try{
          const result = await PenaltyDao.deletePenalty(_id);
          if(result.n == 0){
            throw new handleError(404,'Penalty not found');  
          }
          return result;
      }catch(err){
            throw new handleError(404,'Delete Penalty fail');
      }
  }
  
  static getPenaltys = async(req)=>{
      const {start,end} = req.query;
      try{
          const result = await PenaltyDao.getPenaltys(start,end);
          return result;
      }catch(err){
          throw new handleError(404,'Penalty not found');
      }
  }

  static getPenalty = async(req)=>{
      const {username} = req.params;
      const {start,end} = req.query;
      try{
          const result = await PenaltyDao.getPenalty(username,start,end);
          return result;
      }catch(err){
          throw new handleError(404,'Penalty not found');
      }
  }
}
