import AnswerModel from "../models/AnswerModel.js";

export const addAnswer = async (req, res)=>{
    try {
        const answer = await AnswerModel.create(req.body);
        res.json(answer)
    } catch (error) {
        console.log(error)
    }
}

export const getAnswersForQ = async (req, res)=>{
    try {
        const questionId= req.params.questionId;
        const answers = await AnswerModel.find({questionId: questionId});

        res.json(answers);
        
    } catch (error) {
        console.log(error)
    }
}

export const getAnswerForStudent = async (req, res)=>{
    try {
        const studentId= req.params.studentId;
        const answers = await AnswerModel.find({studentId: studentId});

        res.json(answers);
        
    } catch (error) {
        console.log(error)
    }
}
