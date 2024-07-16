import { controller, httpGet } from "inversify-express-utils";
import { inject } from "inversify";
import { Types } from "../types/types"
import { StatusCode } from "../constant/statuscode";
import { errMSG } from "../constant/message";
import { Request, Response } from "express";
import { Auth } from "../middleware/auth.middleware";
import { Role } from "../middleware/role.middleware";
import { ResultService } from "../service";

@controller('/result' , new Auth().handler)
export class ResultController {
    private resultService: ResultService;

    constructor(@inject(Types.ResultService) RServices: ResultService) {
        this.resultService = RServices;
    }

    @httpGet('/get' ,new Role().handler)
    async login(req: Request, res: Response) {
        try {
            const userpaper  = req.body ;

            const user_Result = await this.resultService.createResult(userpaper);

            res.status(user_Result.statuscode).json(user_Result.content);
        } catch (error: any) {
            res.status(error.statusCode || StatusCode.NotImplemented).json({ message: error.message || errMSG.InternalServerErrorResult })
        }

    }
}