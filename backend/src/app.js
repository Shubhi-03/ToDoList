import express, { application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

app.use(cors({
    origin: ['http://localhost:3001'], // specify the exact origin
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
// app.options('*', cors({
//     origin: 'http://localhost:3001',
//     credentials: true,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: 'Content-Type,Authorization',
//     preflightContinue: false,
//     optionsSuccessStatus: 204
// }));
app.options('*', cors())
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public")) 
app.use(cookieParser())

import userRouter from './routes/user.routes.js';
import taskRouter from './routes/task.routes.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/task", taskRouter)
export { app };