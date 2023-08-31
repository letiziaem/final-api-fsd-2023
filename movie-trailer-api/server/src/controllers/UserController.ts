import { Response, Request, NextFunction } from "express";
import UserService from "../services/UserService.js";
import TokenService from "../services/TokenService.js";
import AuthService from "../services/AuthService.js";
import IUser from "../interfaces/UserInterface.js";
import ApiError from "../utils/ApiError.js";

class UserController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const createdUser = await UserService.register(req.body.name, req.body.email, req.body.roles, req.body.password);

            if(!createdUser) {
                return next(ApiError.InternalServerError("Failed to create user."));
            };

            const {accessToken} = TokenService.generateAccessToken(createdUser);

            res.status(201).json({accessToken: accessToken, user: createdUser});
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const allUsers = await UserService.getAll();

            res.status(200).json(allUsers);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.body.id);

            const foundUser = await UserService.getOne(userId);

            if(!foundUser) {
                throw ApiError.NotFoundError(`User not found for ${userId}`);
            }

            res.status(200).json(foundUser);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {

            const { id } = req.params;

            const { name, email, password, roles } = req.body;
      
            const userData = {
              name,
              email,
              password,
              roles
            } as IUser;
      
            let existingUser: IUser | null = await UserService.update(id, userData);
      
            if(!existingUser) {
              throw ApiError.NotFoundError(`User not found for ${id}`);
            };
      
            existingUser.name = name || existingUser.name;
            existingUser.email = email || existingUser.email;
            existingUser.password = password || existingUser.password;
            existingUser.roles = roles || existingUser.roles;
      
            const updatedUser = await existingUser.save();
      
            res.status(200).json(updatedUser);
            // const userId = parseInt(req.params.id);

            // const updatedUserIndex = await UserService.update();
    
            // if(!updatedUserIndex) {
            //     throw ApiError.NotFoundError(`User not found for ${userId}`);
            // }
    
            // const updatedUser = {
            //     id: userId,
            //     name: req.body.name,
            //     email: req.body.email,
            //     password: req.body.password,
            //     roles: req.body.roles
            // } as IUser

            // users[updatedUserIndex] = updatedUser;
    
            // return updatedUser;
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const deletedUser: IUser | null = await UserService.delete(id);

            if (!deletedUser) {
                throw ApiError.NotFoundError(`User not found for ${id}`);
            }

            res.status(200).json(deletedUser);
            // const userId = parseInt(req.params.id);

            // const deletedUserIndex = users.findIndex((user) => user.id === userId);

            // if (deletedUserIndex === -1) {
            //     throw ApiError.NotFoundError(`User not found for ${userId}`);
            // }

            // const deletedUser = users.splice(deletedUserIndex, 1)[0];

            // return deletedUser;
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();