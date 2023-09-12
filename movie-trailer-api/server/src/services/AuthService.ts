import IUser from "./../interfaces/UserInterface.js";
import { UserModel } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import TokenService from "./TokenService.js";

class AuthService {
  async isAdmin(user: IUser) {
    return user.roles.includes("64f602068cbe339f606b076d");
  }

  async getAll() {
    try {
      const allUsers: IUser[] = await UserModel.find()
        .populate("roles")
        .select("-password");

      console.log(allUsers);

      return allUsers;
    } catch (error) {
      throw error;
    }
  }

  async getOne(userId: string) {
    try {
      const user: IUser = await UserModel.findById(userId)
        .populate("roles")
        .select("-password");
      return user;
    } catch (error) {
        throw error;
    }
  }

  async register(
    name: string,
    email: string,
    password: string,
    roleIds: string[] = []
  ): Promise<IUser> {
    try {
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        throw new Error(`User ${name} already exists`);
      }

      // Assign roles based on provided roleIds or use the default role ID
      const rolesToAssign =
        roleIds.length > 0 ? roleIds : ["64f601d48cbe339f606b076b"];

      const newUser: IUser = new UserModel({
        name,
        email,
        password,
        roles: rolesToAssign,
      });

      const savedUser = await newUser.save();

      return savedUser;
    } catch (error) {
      throw new Error("Registration failed.");
    }
  }

  async login(email: string, password: string): Promise<{token: string, user: IUser} | null> {
    try {
      const user: IUser | null = await UserModel.findOne({ email });
      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return null;
      }

      const token = TokenService.generateAccessToken(user);

      return {token, user};
    } catch (error) {
      throw new Error("Login failed.");
    }
  }
}

export default new AuthService();
