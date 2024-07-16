import mongoose from "mongoose";
import { errMSG } from "../constant/message";

const questionSchema = new mongoose.Schema({
    question : {
        type : String,
        required : [true , errMSG.required("Qustion")]
    },
    answer :{
        type : String,
        required : [true , errMSG.required("Answer")]
    },
    optionA : {
        type : String ,
        required : [true , errMSG.required("Option  A" )],
    },
    optionB : {
        type : String ,
        required : [true , errMSG.required("Option  A" )],

    },
    optionC : {
        type : String ,
        required : [true , errMSG.required("Option  A" )],
    },
    optionD : {
        type : String ,
        required : [true , errMSG.required("Option  A" )],
    },
    hardness : {
        type : Number,
        enum : [1,2,3,4,5,6,7,8,9,10]
    }
});

const Question = mongoose.model('Question', questionSchema);

export default Question;