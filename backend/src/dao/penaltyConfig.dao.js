import PenaltyConfig from '../models/Penalty/PenaltyConfig'

export class PenaltyConfigDao {
  static createPenaltyConfig = async(key,value)=>{
    const penaltyConfig = new PenaltyConfig({
        key,
        value,
    })
    return await penaltyConfig.save();
  }

  static deletePenaltyConfig = async(_id)=>{
    return await PenaltyConfig.deleteOne({
        _id
    });
  }

  static getPenaltyConfig = async(_id)=>{
    return await PenaltyConfig.findOne({
        _id
    });
  }

  static getPenaltyConfigs = async()=>{
    return await PenaltyConfig.find({});
  }

  static updatePenaltyConfig = async(_id,value)=>{
    return await PenaltyConfig.findOneAndUpdate({_id},{value},{new:true});
  }

}
