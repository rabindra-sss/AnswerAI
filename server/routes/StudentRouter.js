import express from 'express';
import { addStudent, getStudent } from '../controllers/StudentController.js';

const studentRouter= express();

studentRouter.post('/add-student', addStudent);

studentRouter.get('/get-student/:id', getStudent);

export default studentRouter;