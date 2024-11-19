import mongoose from 'mongoose';
import { MSG } from '../constant/message'

export const connectDB = async () =>{
	mongoose.connect(`${process.env.DBURL}/${process.env.DBNAME}`)
	console.log(MSG.DBconnected)
}
