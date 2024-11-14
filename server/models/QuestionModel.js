import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    
    testId:{
        type: String
    },
    questionNumber:{
        type: String
    },
    questionText:{
        type: String
    }
})

export default mongoose.model('question', questionSchema);