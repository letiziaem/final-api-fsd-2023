import express from "express";
import UserController from "../controllers/UserController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/users", authMiddleware, UserController.getAll);

router.get("/users/:id", UserController.getOne);

router.post("/users", UserController.register);

router.put("/users/:id", UserController.update);

router.delete("/users/:id", UserController.delete);

export default router;