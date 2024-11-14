import express from 'express';
import { addBasePrompt, addUserPrompt, getBasePrompt, getUserPrompt, updateBasePrompt, updateUserPrompt } from '../controllers/PromptController.js';
import { authUser } from '../middlewares/AuthMiddleware.js';

const promptRouter= express();

promptRouter.get('/get-base-prompt', getBasePrompt);
promptRouter.post('/add-base-prompt', addBasePrompt);
promptRouter.put('/update-base-prompt', updateBasePrompt);

promptRouter.get('/get-user-prompt', authUser, getUserPrompt);
promptRouter.post('/add-user-prompt', authUser, addUserPrompt);
promptRouter.put('/update-user-prompt', authUser, updateUserPrompt);

export default promptRouter;