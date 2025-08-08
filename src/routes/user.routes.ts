import { Router } from "express";
import { chatbot } from "../controllers/user.controller";
// import authMiddleware from "../middleware/auth.middleware";

const router = Router();

// router.get("/", authMiddleware, getUsers);

router.post("/chatbot", chatbot);

export default router;
