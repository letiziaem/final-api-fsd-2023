import express from "express";
import AuthController from "./../controllers/AuthController.js";
import authMiddleware from "./../middlewares/authMiddleware.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/roles",
  [check("name", "Name can't be empty").notEmpty()],
  AuthController.createRole
);

router.delete("/roles/:id", AuthController.deleteRole);

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

router.post(
  "/register",
  [
    check("name", "Name can't be empty").notEmpty(),
    check("email", "Email can't be empty").notEmpty(),
    check("email", "Invalid email").isEmail(),
    check("password")
      .notEmpty()
      .withMessage("Password is required")
      .matches(passwordRegex)
      .withMessage("Password must be safe and secure"),
  ],
  AuthController.register
);

router.post(
  "/login",
  [
    check("email", "Email can't be empty").notEmpty(),
    check("email", "Invalid email").isEmail(),
    check("password", "Password can't be empty").notEmpty(),
  ],
  AuthController.login
);

router.get("/", authMiddleware, AuthController.getAll);

export default router;
