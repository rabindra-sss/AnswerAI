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

export const TestScorer = async (testpaperfile, answerpaperfile, userPrompt) => {
    const fileManager = new GoogleAIFileManager(process.env.AI_API_KEY);

    // Create a temporary file path
    const __dirname= dirname(fileURLToPath(import.meta.url))

    const tempTestPaperFilePath = path.join(__dirname, testpaperfile.originalname);
    const tempAnswerPaperFilePath = path.join(__dirname, answerpaperfile.originalname);


    try {
        // Write the buffer to a temporary file
        await writeFile(tempTestPaperFilePath, testpaperfile.buffer);
        await writeFile(tempAnswerPaperFilePath, answerpaperfile.buffer);


        // Upload the file using the temporary file path
        const testPaperUploadResult = await fileManager.uploadFile(tempTestPaperFilePath, {
            mimeType: testpaperfile.mimetype,       // Get MIME type from the file uploaded
            displayName: testpaperfile.originalname // Use the original file name as display name
        });
        const answerPaperUploadResult = await fileManager.uploadFile(tempAnswerPaperFilePath, {
            mimeType: answerpaperfile.mimetype,       // Get MIME type from the file uploaded
            displayName: answerpaperfile.originalname // Use the original file name as display name
        });

        console.log(
            `Uploaded file ${testPaperUploadResult.file.displayName} as: ${testPaperUploadResult.file.uri}`
        );
        console.log(
            `Uploaded file ${answerPaperUploadResult.file.displayName} as: ${answerPaperUploadResult.file.uri}`
        );

        const basePrompts = await BasePromptModel.find();
        const basePrompt = basePrompts[0].promptText;
        console.log(basePrompt)

        

        // Initialize Google Generative AI
        const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
        // Generate content based on the uploaded file URI
        const result = await model.generateContent([
            "Analyze the provided files, a test paper and an answer paper. Score each answers of the answerpaper based on the questions provided in the testpaper.",
            basePrompt,
            userPrompt,            
            {
              fileData: {
                fileUri: testPaperUploadResult.file.uri,
                mimeType: testPaperUploadResult.file.mimeType,
              },
            },
            {
                fileData: {
                  fileUri: answerPaperUploadResult.file.uri,
                  mimeType: answerPaperUploadResult.file.mimeType,
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
        await unlink(tempTestPaperFilePath);
        await unlink(tempAnswerPaperFilePath);

    }
};
