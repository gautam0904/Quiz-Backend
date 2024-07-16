import { injectable } from "inversify";
import Question from "../model/qouestion.model";
import { StatusCode } from "../constant/statuscode";
import { errMSG, MSG } from "../constant/message";
import { Ipaper } from "../interface/Ipaper.interface";
import Result from "../model/result.model";

@injectable()
export class ResultService {
    constructor() { }

    async createResult(userPaer: Ipaper[]) {
        try {
           
            const aggregationPromises = userPaer.map(async (paper) => {
               
                return await Question.aggregate([
                    {
                        $match: {
                            question: paper.question,  
                            answer: paper.answer     
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalMarks: { $sum: 1 }
                        }
                    }
                ]);
            });
    
            
            const marks = await Promise.all(aggregationPromises);
    
            console.log(marks);  

            const result = await Result.create({
               
            });
    
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
    
}