import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user.routes";
// import errorMiddleware from "./middleware/error.middleware";

const app: Application = express();

// Middleware
app.use(cors({
    origin: ["https://www.develevate.tech"],
    credentials: true,
}));

app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/users", userRoutes);

// Global Error Handler
// app.use(errorMiddleware);

app.listen(3000, () => {
    console.log("Server is Running on 3000");
})

export default app;