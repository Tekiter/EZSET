import PenaltyConfig from '../models/Penalty/PenaltyConfig'

export class PenaltyConfigDao {
  static createPenaltyConfig = async(key,value)=>{
    const penaltyConfig = new PenaltyConfig({
        key,
        value,
    })
    return await penaltyConfig.save();
  }

}
