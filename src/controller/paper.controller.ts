import { controller, httpGet, } from "inversify-express-utils";
import { inject } from "inversify";
import { Types } from "../types/types"
import { StatusCode } from "../constant/statuscode";
import { errMSG } from "../constant/message";
import { Request, Response } from "express";
import { Auth } from "../middleware/auth.middleware";
import { Role } from "../middleware/role.middleware";
import { PaperService } from "../service";

@controller('/paper', new Auth().handler)
export class PaperController {
    private paperService: PaperService;

    constructor(@inject(Types.PaperService) pService: PaperService) {
        this.paperService = pService;

    }

    @httpGet('/create', new Role().handler)
    async createQuestion(req: Request, res: Response) {
        try {

            const userId = req.headers.USERID

            const created_question = await this.paperService.createPaper(userId as string);

            res.status(created_question.statuscode).json(created_question.Content);
        } catch (error: any) {
            res.status(error.statusCode || StatusCode.NotImplemented).json({ message: error.message || errMSG.InternalServerErrorResult })
        }
    }


}