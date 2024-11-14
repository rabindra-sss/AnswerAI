import express from 'express';
import { addTestpaper, getAllTestPaper, scoreTestpaper } from '../controllers/TestpaperController.js';


const testpaperRouter= express();

testpaperRouter.post('/add-testpaper', addTestpaper);

testpaperRouter.get('/get-testpapers', getAllTestPaper);

testpaperRouter.get('/score-testpaper/:testpaperId', scoreTestpaper);

export default testpaperRouter;