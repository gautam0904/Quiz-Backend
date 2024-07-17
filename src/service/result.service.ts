import { inject, injectable } from "inversify";
import Question from "../model/qouestion.model";
import { StatusCode } from "../constant/statuscode";
import { errMSG, MSG } from "../constant/message";
import { Ipaper } from "../interface/Ipaper.interface";
import Result from "../model/result.model";
import mongoose from "mongoose";
import { Types } from "../types/types";
import { UserService } from "./user.service";
import User from "../model/user.model";

@injectable()
export class ResultService {
    constructor(@inject(Types.UserService) userServices: UserService) {
            this.userService = userServices;
     }
    
    userService:UserService
    async createResult(userPaper: Ipaper[],id:string) {

        const session = await mongoose.startSession();
        
    session.startTransaction();

    try {
      const opts = { session };
   
            let marks=0
            const aggregationPromises = userPaper.map(async (paper) => {
                
               
                const rs = await Question.aggregate([
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(paper.question),  
                            answer: paper.answer.trim(),     
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            Marks: { $sum: 1 }
                        }
                    }
                ]);
                if (rs[0]?.Marks) {
                    marks++;
                }
                return rs
            });
    
            
            await Promise.all(aggregationPromises);

            const user = await this.userService.getUserById(id);

            let userLevel = 'level' in user ? user.level : null;

            const result = await Result.create({
                userId : new mongoose.Types.ObjectId(id),
                level : userLevel,
                marks : marks
            });     
            
            if (marks >= 5 && userLevel) {
                userLevel++;
                const r = await User.findByIdAndUpdate(id, { $set:{level : userLevel}});
            }

            return {
                statuscode: StatusCode.Created,
                content: {
                    message: MSG.success('Result is created'),
                    data: result
                }
            };
        } catch (error: any) {
            return {
                statuscode: error.statusCode || StatusCode.NotImplemented,
                content: {
                    message: error.message || errMSG.defaultErrorMsg,
                }
            };
        }
    }

    async getAllResult() {
        try {
            const result = await Result.find().populate('userId');
        return {
            statuscode: StatusCode.OK,
            content: {
                message: MSG.success('All result'),
                data: result
            }
        };
        } catch (error : any) {
            return {
                statuscode: error.statusCode || StatusCode.NotImplemented,
                content: {
                    message: error.message || errMSG.defaultErrorMsg,
                }
            };
        }
    }
    
}