import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    testpaperId:{
        type: String
    },
    questionId: {
        type: String
    },
    studentId:{
        type: String
    },
    answer:{
        type: String
    }
})

export default mongoose.model('answer', answerSchema);