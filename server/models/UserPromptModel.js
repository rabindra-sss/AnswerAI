import mongoose from 'mongoose';

const userPromptSchema = new mongoose.Schema({
    userId:{
        type: String
    },
    promptText: {
        type: String
    }
})

export default mongoose.model('userPrompt', userPromptSchema);