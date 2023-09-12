import mongoose from "mongoose";
import IUser from "../interfaces/UserInterface.js";
import bcrypt from 'bcryptjs';

const RoleSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
    },
  });
  
  export interface IRole extends mongoose.Document {
    name: string;
  };

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: function (value: string) {
                return value.length >= 2
            },
            message: "Name must be at least 2 characters long."
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value: string) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            },
            message: 'Email is not valid.'
        }
    },
    password: {
        type: String,
        required: true,
        set: function (this: IUser, plainPassword: string): string {
            return bcrypt.hashSync(plainPassword, 8)
        },
        get: function (this: IUser, hashedPassword: string): string {
            return hashedPassword;
        },
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        default: "64f601d48cbe339f606b076b"
    }]
});

const RoleModel = mongoose.model<IRole>("Role", RoleSchema);    
const UserModel = mongoose.model<IUser>("User", UserSchema);

export { RoleModel, UserModel };