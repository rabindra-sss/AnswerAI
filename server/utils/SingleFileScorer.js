import fs from 'fs';
import path, {dirname} from 'path';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { promisify } from 'util';
import { fileURLToPath } from 'url'
import BasePromptModel from '../models/BasePromptModel.js';
import UserPromptModel from '../models/UserPromptModel.js';

// Promisify the write and unlink functions
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

export const SingleFileScorer = async (file) => {
    const fileManager = new GoogleAIFileManager(process.env.AI_API_KEY);

    // Create a temporary file path
    const __dirname= dirname(fileURLToPath(import.meta.url))

    const tempFilePath = path.join(__dirname, file.originalname);

    try {
        // Write the buffer to a temporary file
        await writeFile(tempFilePath, file.buffer);

        // Upload the file using the temporary file path
        const uploadResult = await fileManager.uploadFile(tempFilePath, {
            mimeType: file.mimetype,       // Get MIME type from the file uploaded
            displayName: file.originalname // Use the original file name as display name
        });

        // console.log(
        //     `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
        // );

        

        // Initialize Google Generative AI
        const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
    
        // Generate content based on the uploaded file URI
        const result = await model.generateContent([
            "This task is for my own use and knowledge. Analyze the provided file, that has questions. Give answer to each question. provide the following:",
            "1. questionSequence: a number that is the order of the sequence of questions provided. if first photo then 1 if second photo then 2",
            "2. questionText: the question text. limit the number of words shown to 15 words. but the other case, if there are two question having many many things common with slight variation then limit the common words to 15 words and then write `...` then give the text that is unique to that question only",
            "3. questionNumber: actual question number that is visible in the file. if no question number visible then tell `unknown`. if you are unsure about the question number then tell `not sure`",
            "4. option: the correct option that consist the correct answer to the question. if the question is not a option type or multiple choice (e.g. subjective) then tell `NA`",
            "5. answer: the answer to the question.",
            "6. surity: the percentage of how sure you are in your answer. be strict about because I am serous about assurance",
            "provide the results in structured format, example JSON. you must provide the entire response at once as I dont want broken response. hence you need to balance the amount of explanation needed in the answer property accordingly",
            { 
              fileData: {
                fileUri: uploadResult.file.uri,
                mimeType: uploadResult.file.mimeType,
              },
            },
        ]);

        console.log(result.response.text());
        return result.response.text();

    } catch (error) {
        console.error("Error processing file:", error);
        throw error;
    } finally {
        // Delete the temporary file
        await unlink(tempFilePath);
    }
};
