"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
// import errorMiddleware from "./middleware/error.middleware";
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// Routes
app.use("/api/users", user_routes_1.default);
// Global Error Handler
// app.use(errorMiddleware);
app.listen(3000, () => {
    console.log("Server is Running on 3000");
});
exports.default = app;
//# sourceMappingURL=index.js.map