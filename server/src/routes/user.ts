import express from "express";
import * as UserController from "../controllers/user";

const router = express.Router();

router.get("/", UserController.getAllUsers)

router.post("/", UserController.getUser);

export default router;