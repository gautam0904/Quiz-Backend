import { injectable } from "inversify";
import { ApiError } from "../utils/ApiError";
import { StatusCode } from "../constant/statuscode";
import { errMSG, MSG } from "../constant/message";
import { Iquestion } from "../interface/Iquestion.interface";
import Question from "../model/qouestion.model";
;

@injectable()
export class QuestionService {
  constructor() {
  }
  cloudinaryurl = ""

  async createQuestion(questionData: Iquestion) {
    try {
      const result = await Question.create({
        question: questionData.question,
        answer: questionData.answer,
        optionA: questionData.optionA,
        optionB: questionData.optionB,
        optionC: questionData.optionC,
        optionD: questionData.optionD,
        hardness: questionData.hardness
      });
      if (!result) {
        throw new ApiError(StatusCode.NoContent, errMSG.createQuestion)
      }
      return {
        statuscode: StatusCode.Created,
        Content: {
          message: MSG.success('Question is created'),
          data: result
        }
      }
    }
    catch (error: any) {
      return {
        statuscode: error.statusCode || StatusCode.NotImplemented,
        Content: {
          message: error.message || errMSG.defaultErrorMsg,
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
          message: MSG.success('Question is get'),
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

  async updateQuestion(updateData: Iquestion) {
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
            hardness: updateData.hardness,
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