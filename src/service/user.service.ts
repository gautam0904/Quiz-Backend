import { injectable } from "inversify";
import { Iuser } from "../interface/model.interface";
import User from "../model/user.model";
import { ApiError } from "../utils/ApiError";
import { StatusCode } from "../constant/statuscode";
import { errMSG, MSG } from "../constant/message";
import { deleteonCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import mongoose from "mongoose";
import Result from "../model/result.model";
import Paper from "../model/paer.model";

dotenv.config();

@injectable()
export class UserService {
  constructor() {
  }
  cloudinaryurl = ""

  async createUser(userData: Iuser) {
    try {
      const existuser = await User.findOne({ email: userData.email });

      if (existuser) {
        throw new ApiError(StatusCode.Conflict, errMSG.exsistuser)
      }

      const profile = await uploadOnCloudinary(userData.profilePicture);
      this.cloudinaryurl = profile?.url || "";

      const result = await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        profilePicture: profile?.url || ""
      });
      this.cloudinaryurl = "";
      return {
        statusCode: StatusCode.OK,
        content: {
          message: MSG.usercreated,
          data: result
        }
      }
    } catch (error: any) {
      deleteonCloudinary(this.cloudinaryurl).then((response) => {
        this.cloudinaryurl = "";
      })

      return {
        statusCode: StatusCode.OK,
        content: {
          message: error.message || errMSG.InternalServerErrorResult,
        }
      }
    }
  }
  async loginUser(userData: Iuser) {
    try {
      const existUser = await User.findOne({
        email: userData.email
      });

      if (!existUser) {
        throw new ApiError(StatusCode.NotFound, errMSG.notExistUser)
      }


      const isMatch = await bcrypt.compare(userData.password, existUser.password);

      if (!isMatch) {
        throw new ApiError(StatusCode.NotAcceptable, errMSG.passwordNotMatch)
      }

      const token = jwt.sign(
        {
          id: existUser._id,
          role: existUser.role
        },
        process.env.AccessTokenSeceret as string,
        {
          expiresIn: process.env.AccessExpire
        });

      return {
        statuscode: StatusCode.OK,
        Content: {
          message: MSG.success('User logged in'),
          data: {
            token: token,
            user: existUser
          }
        }

      }
    } catch (error: any) {
      return {
        statuscode: error.statusCode,
        Content: {
          message: error.message || errMSG.defaultErrorMsg,
        }
      }
    }
  }

  async deleteUser(userId: string) {
    const session = await mongoose.startSession();
  
    session.startTransaction();
  
    try {
      const opts = { session };
  

      const existUser = await User.findOne({ _id: userId });
      if (!existUser) {
        throw new ApiError(StatusCode.NotFound, `${errMSG.notExistUser}`);
      }

      const deletedUser = await User.findOneAndDelete({ _id: userId });

      await Result.deleteMany({ user: existUser._id });
      await Paper.deleteMany({ user: existUser._id });
  
      await session.commitTransaction();
      session.endSession();
  
      return {
        statuscode: StatusCode.OK,
        content: {
          message: MSG.success('user is deleted'),
          data: deletedUser
        }
      };
    } catch (error: any) {

      await session.abortTransaction();
      session.endSession();
  
      console.error('Transaction aborted. Error:', error.message);
      return {
        statuscode: error.statusCode || StatusCode.NotImplemented,
        content: { message: error.message },
      };
    }
  }
  

  async getAlluser() {
    try {
      const users = await User.aggregate([
        {
          $match: {},
        },
        {
          $project: {
            name: 1,
            email: 1,
            usertype: 1,
            createdAt: 1,
            profilePicture: 1,
            _id: 1
          },
        },
        {
          $sort: {
            createdAt: -1
          }
        }
      ]);
      if (users) {
        return {
          statuscode: StatusCode.OK,
          content: { 
            message : MSG.success('Users get '),
            data : users
           },
        };
      } else {
        throw new ApiError(StatusCode.NotFound, `${errMSG.userNotFound}`);
      }
    } catch (error: any) {
      return {
        statuscode: error.statusCode || StatusCode.NotImplemented,
        content: { message: error.message },
      };
    }
  }

  async updateUserwithprofilepicture(updateData: Iuser): Promise<{ statuscode: any; Content: any; }> {
    try {
  
      const existUser = await User.findById(updateData._id);
  
      let result;
      await deleteonCloudinary(existUser?.profilePicture as string).then(async (response) => {
        const profile = await uploadOnCloudinary(updateData.profilePicture);
        result = await User.findByIdAndUpdate(
          {
            _id: updateData._id,
          },
          {
            $set: {
              name: updateData.name,
              email: updateData.email,
              profilePicture: profile?.url
            },
          },
          { new: true }
        );
        if (result) {
          return {
            statuscode: StatusCode.OK,
            Content: result,
          };
        }
        throw new ApiError(StatusCode.NotImplemented, errMSG.updateUser);
      }).catch((err: any) => {
        throw new ApiError(StatusCode.NotImplemented, errMSG.updateUser);
      });
  
      return {
        statuscode: StatusCode.OK,
        Content: result,
      };
  
    } catch (error: any) {
      deleteonCloudinary(this.cloudinaryurl).then((response) => {
        this.cloudinaryurl = "";
      });
      return {
        statuscode: error.statusCode || StatusCode.NotImplemented,
        Content: error.message,
      };
    }
  }
  
  async updateUserWithoutProfilePicture(updateData: Iuser) {
    try {

      const result = await User.findByIdAndUpdate(
        {
          _id: updateData._id,
        },
        {
          $set: {
            name: updateData.name,
            email: updateData.email,
          },
        },
        { new: true }
      );
      if (result) {
        return {
          statuscode: StatusCode.OK,
          Content: result,
        };
      }
      throw new ApiError(StatusCode.NotImplemented, errMSG.updateUser);
    } catch (error: any) {
      return {
        statuscode: error.statusCode || StatusCode.NotImplemented,
        Content: error.message,
      };
    }
  }


}