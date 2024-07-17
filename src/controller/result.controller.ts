import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { Types } from "../types/types"
import { StatusCode } from "../constant/statuscode";
import { errMSG } from "../constant/message";
import { Request, Response } from "express";
import { Auth } from "../middleware/auth.middleware";
import { Role } from "../middleware/role.middleware";
import { ResultService } from "../service";
import { ApiError } from "../utils/ApiError";

@controller('/result' , new Auth().handler)
export class ResultController {
    private resultService: ResultService;

    constructor(@inject(Types.ResultService) RServices: ResultService) {
        this.resultService = RServices;
    }

    @httpPost('/get' ,new Role().handler)
    async get(req: Request, res: Response) {
        try {
            const {userpaper}  = req.body ;

            const userId = req.headers.USERID as string;

            const user_Result = await this.resultService.createResult(userpaper , userId);

            res.status(user_Result.statuscode).json(user_Result.content);
        } catch (error: any) {
            res.status(error.statusCode || StatusCode.NotImplemented).json({ message: error.message || errMSG.InternalServerErrorResult })
        }

    }

    @httpGet('/getAll',new Role().handler)
    async getAll(req: Request, res: Response) {
        try {
            const Result = await this.resultService.getAllResult();
            
            res.status(Result.statuscode).json(Result.content);
        } catch (error : any) {
            res.status(error.statusCode || StatusCode.NotImplemented).json({
                message : error.message || errMSG.InternalServerErrorResult
            })
        }
    }

}