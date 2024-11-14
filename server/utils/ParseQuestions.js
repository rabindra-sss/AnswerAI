import fs from 'fs';
import path, {dirname} from 'path';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { promisify } from 'util';
import { fileURLToPath } from 'url'

// Promisify the write and unlink functions
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

export const ParseQuestionFile = async (file) => {
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

        console.log(
            `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
        );

        // Initialize Google Generative AI
        const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
        // Generate content based on the uploaded file URI
        const result = await model.generateContent([
            "Analyze the provided PDF document. For each question, identify and extract the following information:",
            "1. **questionNumber:** The unique string that represents a question. It consists of the part it belongs to and sequential number of the question within the part (e.g. part A question 1 then give questionNumber as A.1)",
            "2. **questionText:** The complete text of the question, including any subparts or bullet points",
            "Present the extracted information in a structured format, such as JSON.",
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
