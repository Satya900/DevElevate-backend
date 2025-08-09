"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
// import authMiddleware from "../middleware/auth.middleware";
const router = (0, express_1.Router)();
// router.get("/", authMiddleware, getUsers);
router.post("/chatbot", user_controller_1.chatbot);
exports.default = router;
//# sourceMappingURL=user.routes.js.map