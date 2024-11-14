import QuestionModel from "../models/QuestionModel.js";

export const addQuestion = async (req, res)=>{
    try {
        const question = await QuestionModel.create(req.body);
        res.json(question)
    } catch (error) {
        console.log(error)
    }
}

export const getAllQuestions = async (req, res)=>{
    try {
        const questions = await QuestionModel.find({

        })
        res.json(questions)
        
    } catch (error) {
        console.log(error)
    }
}

