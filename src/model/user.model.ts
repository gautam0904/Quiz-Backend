import mongoose from "mongoose";
import { errMSG } from "../constant/message";
import bcrypt from 'bcryptjs'

const roleValues = ['user' , 'admin']

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true , errMSG.required('User name')],
    },
    email : {
        type : String,
        required : [true , errMSG.required('User email')],
        unique : true
    },
    password : {
        type : String,
        required : [true , errMSG.required('User password')]
    },
    profilePicture :  {
        type : String,
    },
    role : {
        type : String,
    },
    level : {
        type : Number,
        default : 1
    }
},{timestamps : true});

userSchema.pre('save' , function(){
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password , 10);
    }
})

const User = mongoose.model('User' , userSchema);

export default User;