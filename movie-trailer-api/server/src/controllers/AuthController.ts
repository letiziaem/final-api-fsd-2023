import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import AuthService from "./../services/AuthService.js";
import { IRole, RoleModel } from "./../models/UserModel.js";
import ApiError from "../utils/ApiError.js";

class AuthController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userRoles = req.user.roles;

      if (!userRoles.includes("64f602068cbe339f606b076d")) {
        throw ApiError.ForbiddenError("Access denied. User is not an admin.");
      }

      const allUsers = await AuthService.getAll();

      res.status(200).json(allUsers);
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw ApiError.InternalServerError("Error during registration.");
      }
      const { name, email, password, roleIds } = req.body;
      const newUser = await AuthService.register(
        name,
        email,
        password,
        roleIds
      );
//      const { accessToken } = TokenService.generateAccessToken(newUser);
      res.status(201).json(newUser);
    } catch (error) {
      next(ApiError.InternalServerError("Registration failed."));
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const user = await AuthService.login(email, password);

      if (!user) {
        throw ApiError.UnauthorizedError("Authentication failed.");
      }

      res.status(200).json(user);
    } catch (error) {
      next(ApiError.InternalServerError("An internal server error occurred."));
    }
  }

  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      const createdRole: IRole = await RoleModel.create({ name: name });

      res.status(201).json(createdRole);
    } catch (error) {
      next(error);
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleID = req.params.id;

      const deletedRole: IRole | null = await RoleModel.findByIdAndDelete(
        roleID
      );

      if (!deletedRole) {
        throw ApiError.NotFoundError("Role not found.");
      }

      res.status(201).json(deletedRole);
    } catch (error) {
      next(ApiError.InternalServerError("Failed to delete."));
    }
  }
}

export default new AuthController();
