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

  static getPenaltys = async(start,end)=>{
      return await Penalty.find({
          date:{
                $gte: start,
                $lt: end,
          }
      });
  }

  static getPenalty = async(username,start,end)=>{
      return await Penalty.find(
          {
              username,
              date:{
                  $gte: start,
                  $lt: end,
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
