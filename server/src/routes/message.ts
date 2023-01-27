import express from "express";
import * as MessageController from "../controllers/message";

const router = express.Router();

router.get("/d/:username", MessageController.getMessagesByDestination);
router.get("/s/:username/:sender", MessageController.getMessagesBySender);

router.post("/", MessageController.sendMessage);

export default router;