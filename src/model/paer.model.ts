import mongoose from "mongoose";
import { errMSG } from "../constant/message";

const paperSchema = new mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : "user"
    },
    level : {
        type : Number,
        required : [true , errMSG.required("User level")]
    },
    questions : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Question"
    }]
 
});

const Paper = mongoose.model('Paper', paperSchema);

export default Paper;