import { PenaltyConfigDao } from '../dao/penaltyConfig.dao';
import { PenaltyDao } from '../dao/penalty.dao'
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

  static deletePenaltyConfig = async(req)=>{
    const {_id} = req.params;
    const type_id = _id;
    const penaltyConfig = await PenaltyConfigDao.getPenaltyConfig(_id);

    if (penaltyConfig.key == '지각' || penaltyConfig.key == '결석') {
        throw new handleError(400,'삭제할 수 없는 항목입니다.');
    }

    try{
        const result = await PenaltyConfigDao.deletePenaltyConfig(_id);
        if(result.n == 0){
            throw new handleError(404,'PenaltyConfig not found');
        }else{
            const res = await PenaltyDao.deletePenaltys(type_id);
            return res;
        }
    }catch(err){
        throw new handleError(404,'delete PenaltyConfig fail');
    }
    };

}
