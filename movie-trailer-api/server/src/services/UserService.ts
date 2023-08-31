import IUser from "./../interfaces/UserInterface.js";
import IRole from "../interfaces/RoleInterface.js";
import UserModel from "../models/UserModel.js";
import bcrypt from 'bcryptjs';

let users: IUser[] = [];

let roles: IRole[] = [];

class UserService {
    async register(name: string, email: string, password: string, roles: string[]): Promise<IUser | undefined> {
        try {
            if(!password) {
                throw new Error("Password is required.");
            }

            if(!roles.every(role => [role].includes(role))) {
                throw new Error("Invalid role value.");
            }

            const hashedPassword = await bcrypt.hash(password, 8);

            const createdUser = {
                id: users.length + 1,
                name: name,
                email: email,
                password: hashedPassword,
                roles: roles
            } as IUser;

            users.push(createdUser);

            return await createdUser as Exclude<IUser, "password">;
        } catch (error) {
            throw error;
        }
    }
    
    async getAll() {
        try {
            const allUsers = users;

            return await allUsers;
        } catch (error) {
            throw error;
        }
    }

    async getOne(id: number) {
        try {
            const foundUser = users.find((user) => user.id === id);

            return await foundUser;
        } catch (error) {
            throw error;
        }
    }

    async update(id: string, userData: IUser) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(id, userData);

            // const userId = parseInt(req.params.id);

            // const updatedUserIndex = users.findIndex((user) => user.id === userId);
    
            // if(updatedUserIndex === -1) {
            //     throw new Error("User not found.");
            // }
    
            // const updatedUser: IUser = {
            //     id: userId,
            //     name: req.body.name,
            //     email: req.body.email
            // }
    
            // users[updatedUserIndex] = updatedUser;
    
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: string) {
        try { 
            const deletedUser = await UserModel.findByIdAndDelete(id)
            
            return deletedUser;
        } catch (error) {
            throw error;
        }
    }
};

export default new UserService();