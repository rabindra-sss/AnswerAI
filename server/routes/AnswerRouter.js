import express from 'express';
import { addAnswer, getAnswersForQ } from '../controllers/AnswerController.js';

const answerRouter= express();

answerRouter.post('/add-answer', addAnswer);

answerRouter.get('/get-answers/:questionId', getAnswersForQ);

export default answerRouter;