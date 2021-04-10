import { PenaltyConfigDao } from '../dao/penaltyConfig.dao';
import { handleError } from '../models/Error';

export class PenaltyConfigService {
  static createPenaltyConfig = async(req)=>{
      const {key, value} = req.body;
      try{
        const result = await PenaltyConfigDao.createPenaltyConfig(key,value);
        return result;
      }catch(err){
          throw new handleError(404,'Create PenaltyConfig fail');
      }
  };

}
