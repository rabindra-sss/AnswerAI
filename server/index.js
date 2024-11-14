import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import multer from 'multer';

import studentRouter from './routes/StudentRouter.js';
import questionRouter from './routes/QuestionRouter.js';
import answerRouter from './routes/AnswerRouter.js';
import testpaperRouter from './routes/TestpaperRouter.js';
import { ParseQuestionFile } from './utils/ParseQuestions.js';
import { TestScorer } from './utils/TestScorer.js';
import { SingleFileScorer } from './utils/SingleFileScorer.js';
import promptRouter from './routes/PromptRouter.js';
import authRouter from './routes/AuthRoute.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser())

// Configure CORS with explicit origin and credentials
const corsOptions = {
    origin: ['http://localhost:3000', 'https://test-assess.vercel.app'], // Your frontend URL
    credentials: true, // Allow credentials (cookies)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
  // Apply CORS middleware
  app.use(cors(corsOptions));
  

const connectDB = async ()=>{
    try {
        const connected = await mongoose.connect(process.env.MONGO_URL)
        console.log('successfully connected to db')
        
    } catch (error) {
        console.log(error)
        console.log('could not connect to db')
    }

}

const PORT = process.env.PORT || 5000;

app.use('/api/student', studentRouter)
app.use('/api/question', questionRouter)
app.use('/api/answer', answerRouter)
app.use('/api/testpaper', testpaperRouter)
app.use('/api/prompt', promptRouter)
app.use('/api/auth', authRouter)

function extractJSON(text) {
    // Step 1: Remove markdown-related text (e.g. ```json, ``` and newline characters)
    const cleanedText = text
        .replace(/```json/g, '')   // Remove the opening ```json
        .replace(/```/g, '')       // Remove the closing ```
        .replace(/\n/g, '')
        .trim();                    // Remove any leading or trailing whitespace

    // Step 2: Parse the cleaned string as JSON
    try {
        const jsonData = JSON.parse(cleanedText);
        return jsonData;
    } catch (error) {
        console.error('Invalid JSON:', error);
        return null;
    }
}

app.post('/api/score', async (req, res) => {
    const { question, answer } = req.body;

    if (!question || !answer) {
        return res.status(400).json({ error: 'Both question and answer are required.' });
    }

    try {
        // Gemini API Request
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GOOGLE_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            { 
                                text: `Evaluate the following answer to the question on a scale of 1 to 10 and explain the reason. 
                                Return the result as a JSON object with the format {score: number, why: string}.\nQuestion: ${question}\nAnswer: ${answer}`
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        // Extracting the score from the response GEMINI
        const aiResponseString = response.data.candidates[0].content.parts[0].text;
        const aiResponseObject = extractJSON(aiResponseString)
        console.log(aiResponseObject)
        res.json(aiResponseObject);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Something went wrong with AI scoring.' });
    }
});

const upload = multer();
app.post('/api/parse-file', upload.single('file'), async (req, res)=>{
    try {
        const testId = "672cd05bacf5c96361927c6a";
        const text_response= await ParseQuestionFile(req.file);
        const QuestionsArray = extractJSON(text_response);
        const modifiedQuestionsArray = QuestionsArray.map(question => ({
            ...question,
            testId: testId
          }));
        const questions_collection = mongoose.connection.db.collection("questions");
        await questions_collection.insertMany(modifiedQuestionsArray);

        res.json({result: QuestionsArray});
    } catch (error) {
        console.log(error)
    }
});

app.post('/api/score-test-files', upload.fields([{ name: 'file1' }, { name: 'file2' }]), async (req, res) => {
    try {        
        // Assuming both files are uploaded under the names 'file1' and 'file2'
        const file1 = req.files['file1'] ? req.files['file1'][0] : null;
        const file2 = req.files['file2'] ? req.files['file2'][0] : null;
       
        const userPrompt = req.body.userPrompt;

        const text_response1 = await TestScorer(file1, file2, userPrompt)
        const result = extractJSON(text_response1);

        res.json({
            result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error processing files' });
    }
});

app.post('/api/score-test-file', upload.single('file'), async (req, res)=>{
    try {
        // const userPrompt = req.body.userPrompt;

        const text_response= await SingleFileScorer(req.file,);
        const result = extractJSON(text_response);
        
        res.json({result});
    } catch (error) {
        console.log(error)
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
