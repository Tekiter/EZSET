import Attendance from '../models/attendance'

export class AttendanceDao {
  static createAttendance = async(username,realname,state,date)=>{
    return await Attendance.findOneAndUpdate({
          username,
          realname,
          date : new Date(date),
      },{
          state
      },{
          new: true,
          upsert: true
      }).exec();
  }

  static getAttendanceByIdAndDate = async(username,date)=>{
      return await Attendance.find({
          username,
          date : new Date(date),
      }).exec();
  }
  static getAttendanceByDate = async(date)=>{
      return await Attendance.find({
          date : new Date(date)
      }).exec();
  }

  static getAttendanceByPeriod = async(username,startDate,endDate)=>{
      return await Attendance.find(
          {
              username,
              date:{
                  $gte: new Date(startDate),
                  $lte: new Date(endDate),
              },
          }
      ).exec()
  }

  static updateAttendance = async(username,date,state)=>{
      return await Attendance.findOneAndUpdate({
          username,
          date : new Date(date),
      },{
          state
      },{
          new: true,
          upsert: true
      }).exec();
  }
  static deleteAttendances = async(startDate,endDate)=>{
      return await Attendance.deleteMany({
           date:{
                $gte: new Date(startDate),
                $lte: new Date(endDate),
          }
      });
  }
}
