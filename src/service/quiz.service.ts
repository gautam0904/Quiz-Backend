import { injectable } from "inversify";
import { ApiError } from "../utils/ApiError";
import { StatusCode } from "../constant/statuscode";
import { errMSG, MSG } from "../constant/message";
import { Iquestion } from "../interface/Iquestion.interface";
import Question from "../model/qouestion.model";
;

@injectable()
export class QuizService {
  constructor() {
  }
  cloudinaryurl = ""

  async createQuestion(questionData: Iquestion) {
    try {


      const result = await Question.create({
        question: questionData.question,
        answer: questionData.question,
        optionA: questionData.optionA,
        optionB: questionData.optionB,
        optionC: questionData.optionC,
        optionD: questionData.optionD,
        hardness : questionData.hardness
      });
      if(!result ){
        throw new ApiError(StatusCode.NoContent, errMSG.createQuestion)
      }
      return {
        statusCode: StatusCode.OK,
        content: {
          message: MSG.usercreated,
          data: result
        }
      }
    }
    catch(err : any){
        return {
            statusCode: StatusCode.OK,
            content: {
              message: err.message,
            }
  
        }
    }
      }
   
  async getQuestion() {
    try {
      const result = await Question.find({});

      return {
        statuscode: StatusCode.OK,
        Content: {
          message: MSG.success('User logged in'),
          data: result
        }

      }
    } catch (error: any) {
      return {
        statuscode: error.statusCode,
        Content: {
          message: error.message || errMSG.defaultErrorMsg,
        }
      }
    }
  }

  async deleteQuestion(qId: string) {
    try {
      const existQuestion = await Question.findOne({ _id: qId });

      if (!existQuestion) {
        throw new ApiError(StatusCode.NotFound, `${errMSG.notExistQuestion}`);
      }
      const result = await Question.findByIdAndDelete(
        { _id: existQuestion._id }
      );
      return {
        statuscode: StatusCode.OK,
        content: {
          message: MSG.success('Question deleted'),
        },
      };
    } catch (error: any) {
      return {
        statuscode: error.statusCode || StatusCode.NotImplemented,
        content: { message: error.message },
      };
    }
  }

  async updateQuestion (updateData: Iquestion){
    try {
  
      const existQuestion = await Question.findById(updateData._id);
  
      const result = await Question.findByIdAndUpdate(
          {
            _id: updateData._id,
          },
          {
            $set: {
              quistion: updateData.question,
              answer: updateData.answer,
              optionA: updateData.optionA,
              optionB: updateData.optionB,
              optionC: updateData.optionC,
              optionD: updateData.optionD,
              hardness : updateData.hardness,
            },
          },
          { new: true }
        );
          
      return {
        statuscode: StatusCode.OK,
        Content: result,
      };
  
    } catch (error: any) {
      return {
        statuscode: error.statusCode || StatusCode.NotImplemented,
        Content: error.message,
      };
    }
  }
  



}