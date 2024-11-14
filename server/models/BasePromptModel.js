import mongoose from 'mongoose';

const basePromptSchema = new mongoose.Schema({
    name:{
        type: String
    },
    promptText: {
        type: String
    }
})

export default mongoose.model('basePrompt', basePromptSchema);