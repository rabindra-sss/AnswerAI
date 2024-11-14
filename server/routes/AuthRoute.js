import express from "express";
import { signup, signin } from "../controllers/AuthController.js";

const authRouter = express();
// sign up
authRouter.post('/signup',signup);
// sign in
authRouter.post('/signin',signin);


export default authRouter;