import Penalty from '../models/Penalty/Penalty'

export class PenaltyDao {
  static createPenalty = async(username,type,description,date)=>{
    const penalty = new Penalty({
        username,
        type,
        description,
        date,
    })
    return await penalty.save();
  }

  static getPenaltys = async()=>{
      return await Penalty.find({});
  }

  static getPenalty = async(username,startDate,endDate)=>{
      return await Penalty.find(
          {
              username,
              date:{
                  $gte: startDate,
                  $lt: endDate,
              },
          }
      )
  }

  static deletePenalty = async(_id)=>{
      return await Penalty.deleteOne({
          _id,
      });
  }
}
