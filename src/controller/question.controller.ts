import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { Types } from "../types/types"
import { ApiError } from "../utils/ApiError";
import { StatusCode } from "../constant/statuscode";
import { errMSG } from "../constant/message";
import { Request, Response } from "express";
import { Auth } from "../middleware/auth.middleware";
import { Role } from "../middleware/role.middleware";
import { Iquestion } from "../interface/Iquestion.interface";
import { QuestionService } from "../service";

@controller('/question', new Auth().handler)
export class QuestionController {
    private questionService: QuestionService;

    constructor(@inject(Types.QuestionService) questionService: QuestionService) {
        this.questionService = questionService;

    }

    @httpPost('/create', new Role().handler)
    async createQuestion(req: Request, res: Response) {
        try {

            const questionData: Iquestion = req.body as Iquestion;


            const created_question = await this.questionService.createQuestion(questionData);

            res.status(created_question.statuscode).json(created_question.Content);
        } catch (error: any) {
            res.status(error.statusCode || StatusCode.NotImplemented).json({ message: error.message || errMSG.InternalServerErrorResult })
        }
    }

    @httpGet('/get')
    async get(req: Request, res: Response) {
        try {

            const get_question = await this.questionService.getQuestion();

            res.status(get_question.statuscode).json(get_question.Content);
        } catch (error: any) {
            res.status(error.statusCode || StatusCode.NotImplemented).json({ message: error.message || errMSG.InternalServerErrorResult })
        }

    }

    @httpDelete('/delete/:id?' , new Role().handler)
    async delete(req: Request, res: Response) {
        try {
            const questionId = req.params.id;
            if (!questionId) {
                throw new ApiError(StatusCode.NotAcceptable, errMSG.notExistQuestion);
            }

            const deleted_question = await this.questionService.deleteQuestion(questionId as string);

            res.status(deleted_question.statuscode).json(deleted_question.content);
        } catch (error: any) {
            res.status(error.StatusCode || StatusCode.NotImplemented).json({ message: error.message || errMSG.InternalServerErrorResult })
        }
    }

    @httpPut('/update/:id?')
    async update(req: Request, res: Response) {
        try {

            const updateData: Iquestion = req.body as Iquestion;
            updateData._id = req.params.id;

            const updated_question = await this.questionService.updateQuestion(updateData);

            res.status(updated_question.statuscode).json(updated_question.Content);
        } catch (error: any) {
            res.status(error.StatusCode || StatusCode.NotImplemented).json({ message: error.message || errMSG.InternalServerErrorResult })
        }
    }
}