import { Request, Response, NextFunction } from "express";
import { BaseMiddleware } from "inversify-express-utils";
import { ApiError } from "../utils/ApiError";
import { StatusCode } from "../constant/statuscode";
import { errMSG } from "../constant/message";


export class Role extends BaseMiddleware{
    handler(req: Request, res: Response, next: NextFunction): void {
        try {
            const permission = {
                admin: ['/user/deleteUser', '/user/get', '/user/update','/user/updatepicture', '/question/get', '/question/update', '/question/delete', '/question/create'],
                user: ['/user/update', '/user/updatepicture', '/question/get' ,'/paper/create','/result/get'],
            }

            const role = req.headers.ROLE as string;
            const currentRoute = req.protocol + "://" + req.get("host") + req.originalUrl;
            const parsedUrl = new URL(currentRoute);
            const pathname = parsedUrl.pathname;
            const userPermissions = permission[role as keyof typeof permission];
            
            const isPermitted = userPermissions.some(perm => pathname.startsWith(perm));

            if (isPermitted) {
                next();
            } else {
                throw new ApiError(StatusCode.Forbidden, errMSG.notValidRole(role));
            }
        } catch (error: any) {
            res.status(error.statusCode || StatusCode.NotImplemented).json({
                message: error.message
            });
        }
    }
} 


