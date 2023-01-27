import "dotenv/config";
import express, { Request, Response, NextFunction } from 'express';
import createHttpError, { isHttpError } from "http-errors";
import userRouter from "./routes/user";
import messageRouter from "./routes/message"
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.ORIGIN, 
  credentials: true
}));
app.enable('trust proxy');

app.use("/api/", userRouter);
app.use("/api/msg/", messageRouter)

// Error handling
app.use((request, responce, next) => {
  next(createHttpError(404, "Route not found."))
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, request: Request, responce: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "Unknown error occured.";
  let statusCode = 500;

  if (isHttpError(error)){
    errorMessage = error.message;
    statusCode = error.status;
  }

  responce.status(statusCode).json({ error: errorMessage });
});

export default app;