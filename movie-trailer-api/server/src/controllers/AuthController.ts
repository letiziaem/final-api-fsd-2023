import { Request, Response } from "express";
import { validationResult } from "express-validator";
import AuthService from "./../services/AuthService.js";
import TokenService from "./../services/TokenService.js";
import UserModel from "./../models/UserModel.js";
import RoleModel from "../models/RoleModel.js";
import IRole from "../interfaces/RoleInterface.js";
import bcrypt from 'bcryptjs';

class AuthController {
  async getAll(req: Request, res: Response) {
    try {
      const userRoles = req.user.roles;

      if (!userRoles.includes("64d4ce1067e9ac029c7d140f")) {
        return res.status(403).json({ error: "Access denied. User is not an admin." });
      }

      const allUsers = await AuthService.getAll();

      res.json(allUsers);
    } catch (err) {
      console.log(err)
    }
  }
  async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(500)
          .json({ message: "Error during registration.", errors });
      }
      const { name, email, password, roleIds } = req.body;
      const newUser = await AuthService.register(name, email, password, roleIds);
      const { accessToken } = TokenService.generateAccessToken(newUser);
      res.status(201).json({ accessToken: accessToken, user: newUser });
    } catch (err) {
      res.status(500).json({ errorMessage: 'Registration failed', error: err });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      const { accessToken } = TokenService.generateAccessToken(user);

      res.json({ accessToken, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async createRole(req: Request, res: Response) {
    try {
      const { roleName } = req.body;
      const createdRole: IRole = await RoleModel.create({ name: roleName })
      return res.status(201).json(createdRole);
    } catch (err) {
      console.log(err)
    }
  }

  async deleteRole(req: Request, res: Response) {
    try {
      const roleID = req.params.id;

      const deletedRole: IRole | null =
        await RoleModel.findByIdAndDelete(roleID);

      if (!deletedRole) {
        res.status(404).json({ error: 'Role not found' });
      }

      res.json(deletedRole);
    } catch (err) {
      console.log(err);
      res.status(500)
        .send({ errorMessage: 'Failed to delete role', error: err });
    }
  }
}

export default new AuthController();