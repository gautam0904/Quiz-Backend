import { injectable } from "inversify";
import { Ipaper } from "../interface/Ipaper.interface";
import Question from "../model/qouestion.model";
import { StatusCode } from "../constant/statuscode";
import { errMSG, MSG } from "../constant/message";
import User from "../model/user.model";
import { ApiError } from "../utils/ApiError";
import Paper from "../model/paer.model";

@injectable()
export class PaperService {
  constructor() { }

  async createPaper(id : string) {
    try {
      const user = await User.findById(id);

      const UserLevel = user?.level;
  
      
      if (!UserLevel) {
        throw new ApiError(StatusCode.NotAcceptable , errMSG.notaligableUser)
      }

      
      const paper1 = await Question.aggregate([
        {
          "$match": {
            "hardness": Math.floor(UserLevel/10 +1)
          }
        },
        {
          "$sample": {
            "size":  Math.floor(UserLevel/10 +1)
          }
        },
        {
          $project: {
            question: 1,
            optionA: 1,
            optionB: 1,
            optionC: 1,
            optionD: 1,
            hardness :1,
            _id: 1
          },
        },
      ]
      );


      
      const paper2 = await Question.aggregate([
        {
          "$match": {
            "hardness": {
               "$lt": (UserLevel/10 +1)
            }
          }
        },
        {
          "$sample": {
            "size": 10 - Math.floor(UserLevel/10 +1)
          }
        },
        {
          $project: {
            question: 1,
            optionA: 1,
            optionB: 1,
            optionC: 1,
            optionD: 1,
            _id: 1
          },
        },
      ]
      )
      const paper =  paper1.concat(paper2);

      const questionIdArray = paper.map(item => item._id);

      await Paper.create({
        user : id,
        level : UserLevel,
        questions : questionIdArray
      })

      return {
        statuscode: StatusCode.Created,
        Content: {
          message: MSG.success('paper is created'),
          data: paper
        }
      }
    } catch (error : any) {
      return {
        statuscode: error.statusCode || StatusCode.NotImplemented,
        Content: {
          message: error.message || errMSG.defaultErrorMsg,
          data : error
        }
      }
    }
    

  }
}