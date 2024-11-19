import mongoose from 'mongoose';
import { MSG } from '../constant/message'

export const connectDB = async () =>{
	console.log(process.env.DBURL); // Check if it's the expected value

	mongoose.connect(`${process.env.DBURL}/${process.env.DBNAME}`)
	console.log(MSG.DBconnected)
}
