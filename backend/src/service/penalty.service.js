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
          console.log(err)
          throw new handleError(500,'Create Penalty fail');
      }
  };
}
