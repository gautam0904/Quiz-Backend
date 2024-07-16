import mongoose from "mongoose";
import { errMSG } from "../constant/message";

const resultSchema = new mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : "user"
    },
    level : {
        type : Number,
        required : [true , errMSG.required('User level')]
    },
    marks : [{
        type : Number,
        required : [true , errMSG.required('User marks')]
    }],
 
});

const Result = mongoose.model('Result', resultSchema);

export default Result;