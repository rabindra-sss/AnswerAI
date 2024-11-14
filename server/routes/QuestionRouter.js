import express from 'express';
import { addQuestion, getAllQuestions } from '../controllers/QuestionController.js';

const questionRouter= express();

questionRouter.post('/add-question', addQuestion);

questionRouter.get('/get-questions', getAllQuestions);

export default questionRouter;