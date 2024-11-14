import axios from 'axios'

export const GeminiScorer = async (question, answer) => {

    if (!question || !answer) {
        throw 'Both question and answer are required.'
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

        return aiResponseObject;
    } catch (error) {
        console.error(error.message);
        return 'Something went wrong with AI scoring in utils.';
    }
}

function extractJSON(text) {
    // Step 1: Remove markdown-related text (e.g. ```json, ``` and newline characters)
    const cleanedText = text
        .replace(/```json/g, '')   // Remove the opening ```json
        .replace(/```/g, '')        // Remove the closing ```
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